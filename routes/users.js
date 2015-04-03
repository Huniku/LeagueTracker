var Models = require('../schema');
var User = Models.userModel;
var League = Models.leagueModel;

/* GET /users/login - login page. */
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

/* POST /users/login - login action      */
/* 200 - returns the user that logged in */
/* 403 - incorrect pw                    */
/* 404 - couldn't find user              */
/* 500 - DB error                        */
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
                user.password = null;
                delete user.password;
                user._id = null;
                delete user._id;
                user.__v = null;
                delete user.__v;
                res.status(200).send(user);
            } else {
                res.status(403).end();
            }
        });
    });
}

/* POST /users - create a new user     */
/* 200 - returns the created user      */
/* 409 - username/email already in use */
/* 500 - DB error                      */
exports.createUser = function(req,res) {
    console.log(req.body);
    var user = new User({
        username: req.body.username,
        displayname: req.body.displayname,
        email: req.body.email,
        password: req.body.password
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
        user.password = null;
        delete user.password;
        user.email = null;
        delete user.email;
        user.decks = [];
        res.status(201).send(user);
    });
}

/* PUT /users/:username/password - validate and update a user's password */
/* 200 - success                                                         */
/* 400 - neither oldpassword nor email were sent                         */
/* 403 - password or email did not match                                 */
/* 404 - user not found OR other DB error                                */
exports.updatePassword = function(req, res) {
    User.findOne({'username': req.params.username}, 'username displayname email password decks', function(err, user) {
        if(err) {
            res.status(404).end();
            return;
        }
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
            res.status(403).end();
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

/* GET /users - returns a censored array of all users */
/* 200 - an array of users                            */
/*  */
exports.getUsers = function(req,res) {
    User.find({}, 'username displayname decks', function(err, users) {
        if (err) {
            console.error("getUsers Error", err);
            res.status(500).end();
            return;
        }
        res.status(200).send(users);
    });
}

/* GET /users/:username - returns a censored user */
/* 200 - the user requestd                        */
/*  */
exports.getUser = function(req,res) {
    User.findOne({'username': req.params.username}, 'username displayname decks', function(err, user) {
        if (err) {
            console.error("AttemptLogin Error finding user", req.params.username, err);
            res.status(500).end();
            return;
        }
        res.status(200).send(user);
    });
}