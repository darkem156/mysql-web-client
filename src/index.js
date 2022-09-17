// Modules
const express = require('express');
const morgan = require('morgan');
const db = require('./modules/database.js');
const session = require('express-session');

const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Sessions
const sessionMW = session(
  {
    key: 'db-data',
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }
)

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(sessionMW);
function getDB(req, res, next) 
{
  if(req.session.db_name) next()
  else res.redirect('/setDB')
}

// Routes
app.use('/api', require('./routes/api.js'));

app.get('/', getDB, (req, res) =>
{
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/setDB', (req, res) =>
{
  res.sendFile(__dirname + '/public/setDB.html')
})

// Static Files
app.use(express.static(__dirname + '/public'));

// Server
app.listen(
  app.get('port'), () =>
  {
    console.log('Server on Port', app.get('port'));
  }
)
