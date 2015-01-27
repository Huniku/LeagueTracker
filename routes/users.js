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
    console.log(req.body);
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {
            console.error("AttemptLogin Error finding user", req.body.username, err);
            res.status(500).end();
            return;
        }

        if(user === null || req.body.password === null || req.body.password === "") {
            res.status(404).end();
            return;
        }

        // test the password
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) {
                console.error("AttemptLogin Error comparing password", req.body.username, err);
                res.status(500).end();
                return;
            }
            if(isMatch) {
                var sess = req.session;
                sess.login = true;
                sess.username = req.body.username;
                res.status(200).end();
            } else {
                res.status(403).end();
            }
        });
    });
}

exports.createUser = function(req,res) {
    console.log(req.body);
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
                res.status(409).end();
                return;
            }
            console.error("createUser Error saving user", req.body.username, err)
            res.status(500).end();
            return;
        } 
        var sess = req.session;
        sess.login=true;
        sess.username = req.body.username;
        res.status(200).end();
    });
}

exports.updatePassword = function(req, res) {
    User.findOne({'username': req.params.username}, 'username displayname email password games decks leagues', function(err, user) {
        var executeUpdatePassword = function(err, isMatch) {
            if(!err && isMatch) {
                user.password = req.body.password;
                user.save(function(err) {
                    if(err) {
                        console.error("updatepassword Error finding user", req.body.username, err)
                        res.status(400).end();
                        return;
                    }
                    user.password = null;
                    user.email = null
                    res.status(200).send(user);
                });
                return;
            }
            console.error("Error Updating Password", err);
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
        if (err) {
            console.error("getUsers Error", err);
            res.status(500).end();
            return;
        }
        res.status(200).send(users);
    });
}

exports.getUser = function(req,res) {
    User.findOne({'username': req.params.username}, 'username displayname games decks leagues', function(err, user) {
        if (err) {
            console.error("AttemptLogin Error finding user", req.params.username, err);
            res.status(500).end();
            return;
        }
        res.status(200).send(user);
    });
}

exports.getFilteredUsers = function(req,res) {
    User.find({}, 'username displayname games decks leagues', function(err, users) {
        if (err) {
            console.error("AttemptLogin Error finding user", err);
            res.status(500).end();
            return;
        }
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