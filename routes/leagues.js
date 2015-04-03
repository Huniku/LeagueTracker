var Models = require('../schema');
var League = Models.leagueModel;
var User = Models.userModel;

/* GET /leagues/:leagueName */
/* 200 - A fully populated League */
/* 500 - a DB error */
exports.getLeague = function(req, res) {
    League.findOne({name: req.params.leagueName}).populate('admins', 'username').populate('players', 'username displayname').exec(function(err, league) {
        if(err) {
            console.error("getUsersFromLeague Error finding users", err);
            res.status(500).end();
            return;
        }
        res.status(200).send(league);
    });
};

/* GET /leagues - returns an array of all leagues */
/* 200 - an array of leagues                            */
/*  */
exports.getLeagues = function(req,res) {
    League.find({}, 'name', function(err, leagues) {
        if (err) {
            console.error("getUsers Error", err);
            res.status(500).end();
            return;
        }
        res.status(200).send(leagues);
    });
}

/* POST /leagues - create a new league     */
/* 200 - returns the created leage      */
/* 409 - league name already in use */
/* 500 - DB error                      */
exports.createLeague = function(req,res) {
    var sess = req.session;
    User.findOne({'username': sess.username}, 'username displayname games decks leagues', function(err, user) {
        if (err) {
            console.error("AttemptLogin Error finding user", req.body.username, err);
            res.status(500).end();
            return;
        }
        console.log(req.body);
        var league = new League({
            admins: [user._id],
            name: req.body.leagueName,
            players: [user._id],
            tournaments: [],
            games: [],
            seasons: []
        });
        league.save(function(err) {
            if(err) {
                if(err.code == 11000) {
                    res.status(409).end();
                    return;
                }
                console.error("createLeauge Error saving league", req.body.leagueName, err)
                res.status(500).end();
                return;
            }
            res.status(201).send(league);
        });
    });
}

/* PUT /leagues/:league/players */
/* 200 - sucess */
/* 409 - player already in league */
/* 500 - DB error */
exports.addUserToLeague = function(req,res) {
    var sess = req.session;
    sess.username
    League.findOne({name: req.params.leagueName}).populate('players', 'username displayname').exec(function(err, league) {
        if(err) {
            console.error("getUsersFromLeague Error finding users", err);
            res.status(500).end();
            return;
        }
        for(var player in league.players) {
            if(player.username == sess.username) {
                console.error("player already in leageue!", sess.username);
                res.status(409).end();
                return;
            }
        }
    });
    
}