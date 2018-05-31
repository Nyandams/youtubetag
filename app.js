const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  morgan = require('morgan'),
  passport = require('passport');
  cookieParser = require('cookie-parser');
  engine = require('ejs-locals');
  favicon = require('serve-favicon')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());
app.use(cookieParser());

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon.jpg'));



//authentification service
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');

const randomSecretKey = uuidv4();
var authService = require('./service/authService')(randomSecretKey, bcrypt, jwt);

require('./routes/tagsRouteur').controller(app, authService);
require('./routes/youtubeRouteur').controller(app, authService);
require('./routes/userRouteur').controller(app, authService);
require('./routes/homeRouteur').controller(app, authService);
require('./routes/tagLinkRouteur').controller(app, authService);

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Resource Not Found');
    err.status = 404;
    next(err);
});

// error handling
app.use(function(err, req, res, next) {

    if(err.status == 404) {
        const { method, url } = req;

        console.log(method);
        console.log(url);
        console.log('______________error 404_____________');

        res.render('pages/404', {locals: {
            title: 'Erreur', error: err
        }});
    }
    else {
        console.log('______________error_____________');
        console.log(err);
        res.render('pages/error', {locals:{
            title: 'Erreur',
            error: err
        }});
    }
});


//récupération du port
app.set( 'port', process.env.PORT);

// Start node server
const server = app.listen( app.get( 'port' ), function() {
    console.log( 'Node server is running on port ' + app.get( 'port' ));
});

module.exports = app;
