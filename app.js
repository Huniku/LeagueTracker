var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
	res.render('index', {title: 'Hey', message:'Hello There!'});
})
app.get('/hello.txt', function(req,res) {
	res.send('Hello World');
});

var server = app.listen(process.env.npm_package_config_port, function() {
	console.log('Listening on port %d', server.address().port);
});