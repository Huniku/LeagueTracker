var User = require('../schema/UserModel.js');

/* GET login page. */
exports.login = function(req, res) {
    if(req.query.login=="failed") {
        console.log("Incorrect Login Render");
        res.render('users/login', {title: 'Hey', error:'Incorrect Login'});
        return;
    } else if(req.query.createUser == "alreadyExists") {
        console.log("Incorrect Login Render");
        res.render('users/login', {title: 'Hey', error:'Username Already In Use'});
        return;
    }
	res.render('users/login', {title: 'Hey', message:'Welcome!'});
};

exports.attemptLogin = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) throw err;

        if(user == null) {
            res.redirect('/users/login?login=failed');
            return;
        }

        // test the password
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) throw err;
            if(isMatch) {
                var sess = req.session;
                sess.login = true;
                sess.username = req.body.username;
                res.redirect('/');
            } else {
                res.redirect('/users/login?login=failed');
            }
        });
    });
}

exports.createUser = function(req,res) {
    var user = new User({
        username: req.body.username,
        displayname: req.body.displayname,
        password: req.body.password
    });
    user.save(function(err) {
        if(err) {
            if(err.code == 11000) {
                res.redirect('/users/login?createUser=alreadyExists');
                return;
            }
            throw err;
        } 
        var sess = req.session;
        sess.login=true;
        sess.username = req.body.username;
        res.redirect('/');
    })
}

exports.getUsers = function(req,res) {
    User.find(function(err, users) {
        if(err) throw err;
        var response = {users:[]};
        for (var i = users.length - 1; i >= 0; i--) {
            response.users[i] = {};
            response.users[i].username = users[i].username;
            response.users[i].displayname = users[i].displayname;
        };
        res.send(response);
        res.status(200);
    });
}