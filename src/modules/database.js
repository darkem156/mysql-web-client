const mysql = require('mysql');

class DB
{
  create(host, user, password, database)
  {
    this.options =
    {
      host: host,
      user: user,
      password: password,
      database: database
    }
  }
  connect(req, res, next)
  {
    const { host, user, password, db_name } = req.session;
    const con = mysql.createConnection(
      {
        host: host,
        user: user, 
        password: password,
        database: db_name
      }
    )
    res.locals.con = con;
    if (host === '' || user === '' || password === '' || db_name === '') res.json({ error: 'Must give all DB Options' })
    else next();
  }
  query(query, res)
  {
    const con = res.locals.con;
    con.connect(error =>
    {
      if(error) return { error: error }
    });
    let data = new Promise((resolve, reject) => 
    {
      con.query(query,  (err, results )=>
      {
        if(err) return resolve({ error: err.sqlMessage });
        return resolve(results);
      });
    });
    con.end();
    return data
  }
}

module.exports = new DB();
