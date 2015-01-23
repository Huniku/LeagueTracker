var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressLogger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/LeagueTracker1');

var path = require('path');
var home = require('./routes/home.js');
var users = require('./routes/users.js');
var app = express();

app.use(cookieParser());
app.use(expressSession({secret:"HerpDeDerpDeDerp", resave:true, saveUninitialized:false}));

app.set('views', './views');
app.set('view engine', 'jade');

app.use(expressLogger('dev'));
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.Router());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    console.log(req.url);
	var sess = req.session;
    if(sess.login && req.url == '/users/login') { 			//if logged in and trying to get to login, go home
    	console.log("Logged in and going to /login, redirecting");
    	res.redirect('/');
    } else if (sess.login || req.path == '/users/login' || req.path == "/users") { 	//if logged in OR going to login, OK
        console.log('Logged in or going to /login');
        next();
    } else {												//if logged out and not going to login, go login
        console.log('Logged out, not going to /login, redirecting');
        res.redirect('/users/login');
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    app.get('/', home.index);
    app.get('/users/login', users.login);
    app.post('/users/login', users.attemptLogin);
    app.post('/users', users.createUser);
    app.get('/users', users.getUsers);
    app.get('/users/:username', users.getUser);
    app.put('/users/:username/password', users.updatePassword);
});



//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

/// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

var server = app.listen(process.env.npm_package_config_port, function() {
	console.log('Listening on port %d', server.address().port);
	console.log("Environment: %s", app.get('env'));
    console.error("<<<<<<<<<<<<<<<<<<<<< ERROR >>>>>>>>>>>>>>>>>>>>>>>");
    console.info("<<<<<<<<<<<<<<<<<<<<< INFO >>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("<<<<<<<<<<<<<<<<<<<<< LOG >>>>>>>>>>>>>>>>>>>>>>>>>");
});