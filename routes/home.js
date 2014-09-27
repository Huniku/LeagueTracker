/* GET home page. */
exports.index = function(req, res) {
	res.render('home', {title: 'Hey', message:'Hello There!'});
};
