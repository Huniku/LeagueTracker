/* GET home page. */
exports.index = function(req, res) {
	var sess = req.session;
	if(sess.login) {
    	res.render('index', {title: 'Hey', message:'Hello There!'});
    } else {
    	sess.login=true;
    	res.render('index', {title: 'Hey', message:'Welcome newcomer'});
    }
    
};
