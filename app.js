const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  morgan = require('morgan'),
  passport = require('passport');
  cookieParser = require('cookie-parser');
  engine = require('ejs-locals');

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

// router
const router = require('./routes/mainRouteur');
// routes

app.use('*',router);

//récup
app.set( 'port', process.env.PORT);

// Start node server
const server = app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
});

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Resource Not Found');
    err.status = 404;
    next(err);
});

// error handling
app.use(function(err, req, res, next) {
    console.log('Erreur : \n' + err);
    if(err.status == 404) {
        res.render('pages/404', {
            title: 'Erreur', error: err
        });
    }
    else {
        res.render('pages/error', {
            title: 'Erreur',
            error: err
        });
    }
});

module.exports = app;
