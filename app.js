const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  morgan = require('morgan'),
  passport = require('passport');
  cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());
app.use(cookieParser());

//database


// router
const api = require('./routes/mainRouteur');
// routes

app.use('/api',api);


//On indique ou se trouvent les fichiers
app.use(express.static(path.join(__dirname,'../dist/webIG3/')));
//Requete de base qui envoi vers index.html
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname,'../dist/webIG3/index.html'));
});

//récup
app.set( 'port', process.env.PORT);

// Start node server
const server = app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
});

module.exports = app;
