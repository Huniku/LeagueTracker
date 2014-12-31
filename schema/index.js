var User = require('./UserModel.js'),
    Game = require('./GameModel.js'),
    League = require('./LeagueModel.js'),
    Season = require('./SeasonModel.js'),
    Tournament = require('./TournamentModel.js');

exports.userModel = User.userModel;
exports.gameModel = Game.gameModel;
exports.leagueModel = League.leagueModel;
exports.tournamentModel = Tournament.tournamentModel;