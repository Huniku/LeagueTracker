var Models = require('../schema');
var User = Models.userModel;
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
        email: req.body.email,
        password: req.body.password,
        games: [],
        leagues: []
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
    });
}

exports.updatePassword = function(req, res) {
    User.findOne({'username': req.params.username}, 'username displayname email password games decks leagues', function(err, user) {
        var executeUpdatePassword = function(err, isMatch) {
            if(!err && isMatch) {
                user.password = req.body.password;
                user.save(function(err) {
                    if(err) {
                        res.status(400).end();
                    }
                    user.password = null;
                    user.email = null
                    res.status(200).send(user);
                });
                return;
            }
            console.log("Error Updating Password");
            console.log('err', err);
            console.log('isMatch', isMatch);
            res.status(400).end();
        };
        if(req.body.oldpassword) {
            user.comparePassword(req.body.oldpassword, executeUpdatePassword);
        } else if(req.body.email) {
            user.compareEmail(req.body.email, executeUpdatePassword);
        } else {
            console.log('Could not authenticate for pw update');
            res.status(400).end();
        }
        
    });
}



exports.getUsers = function(req,res) {
    User.find({}, 'username displayname games decks leagues', function(err, users) {
        if(err) throw err;
        res.status(200).send(users);
    });
}

exports.getUser = function(req,res) {
    User.findOne({'username': req.params.username}, 'username displayname games decks leagues', function(err, user) {
        if(err) throw err;
        res.status(200).send(user);
    });
}

exports.getFilteredUsers = function(req,res) {
    User.find({}, 'username displayname games decks leagues', function(err, users) {
        if(err) throw err;
        var filter = {
            username: req.username,
            displayname: req.displayname,
            league: req.league
        }
        var response = {users:[]};
        var count = 0;
        for (var i = 0; i < users.length; ++i) {
            if(userSatisfiesFilter(users[i], filter) ) {
                response.users[count] = users[i];
            }
        };
        res.status(200).send(response);
    });
}

function userSatisfiesFilter(user, filter) {
    if(user.username == filter.username) {
        return true;
    } else if(user.displayname == filter.displayname) {
        return true;
    } else {
        for (var i = user.leagues.length - 1; i>= 0; --i){
            if(user.leagues[i].name == filter.league) {
                return true;
            }
        }
        return false;
    }
}