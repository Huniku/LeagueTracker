var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressLogger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var routes = require('./routes');
var app = express();

app.use(cookieParser());
app.use(expressSession({secret:"HerpDeDerpDeDerp", resave:true, saveUninitialized:false}));

app.set('views', './views');
app.set('view engine', 'jade');

app.use(expressLogger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.Router());

app.get('/', routes.index);
app.get('/hello.txt', function(req,res) {
	res.send('Hello World');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

var server = app.listen(process.env.npm_package_config_port, function() {
	console.log('Listening on port %d', server.address().port);
	console.log("Environment: %s", app.get('env'));
});