/* GET login page. */
exports.login = function(req, res) {
	res.render('users/login', {title: 'Hey', message:'Welcome!'});
};