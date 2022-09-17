const db = require('../modules/database.js');
const express = require('express');
const router = express.Router();

router.use(db.connect)

router.post('/setDB', (req, res) =>
{
  if(!req.body.host || !req.body.user || !req.body.password || !req.body.name) res.send('Must give all DB Data');
  else
  {
    const { host, user, password, name } = req.body;
    req.session.host = host;
    req.session.user = user;
    req.session.password = password;
    req.session.db_name = name;
    res.send('DB Uploaded')
  }
})

router.get('/getDB', (req, res) =>
{
  const data = req.session;
  const resp = { host: data.host, user: data.user, password: data.password, name: data.db_name }
  res.json(resp);
})

router.post('/query', async (req, res) =>
{
  const resp = await db.query(req.body.query, res);
  console.log(resp)
  res.json(resp);
})

router.get("/table/:table", async (req, res) =>
{
  const { table } = req.params
  const rows = await db.query(`SELECT * FROM ${ table }`, res)
  res.json(rows)
});

router.patch('/:table/:priKey/:value', async (req, res) =>
{
  const { table, priKey, value } = req.params;
  const data = req.body;
  
  const response = {};
  for (const column in data) 
  {
    const resp = await db.query(`UPDATE ${ table } SET ${ column } = ${ data[column] } WHERE ${ priKey } = ${ value }`, res)
    if(resp.error != '')
    {
      response.error = resp.error;
      break
    }
  }
  res.json(response)
})

router.delete("/:table/:priKey/:value", async (req, res) =>
{
  const { table, priKey, value} = req.params;
  const resp = await db.query(`DELETE FROM ${ table } WHERE ${ priKey } = ${ value }`, res);
  res.json(resp);
});

router.delete("/:table", async (req, res) =>
{
  const { table } = req.params;
  const resp = await db.query(`DROP TABLE ${ table }`, res);
  res.json(resp);
});

module.exports = router;
