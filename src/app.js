'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

var exphbs = require('express-handlebars');
var hbsHelpers = require('./lib/helpers/handlebars');
var stylus = require('stylus');

// Loading config
global.$config = require('./lib/config');

// Stylus middleware
if (!$config().html.css.stylusPrecompile) {
    app.use(
        stylus.middleware({
            src: __dirname + '/stylus',
            dest: __dirname + '/public/css',
            compile: function(str, path) {
                return stylus(str).set('filename', path).set('compress', true);
            }
        })
    );
}

// Handlebars setup
app.engine($config().views.engine, exphbs({
    extname: $config().views.extension,
    defaultLayout: $config().views.layout,
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: hbsHelpers
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', $config().views.engine);

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if (!module.parent) {
    app.listen($config().serverPort);
}

module.exports = app;