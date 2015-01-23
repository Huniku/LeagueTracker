var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
    team0: [{ type: String, required: true }],
    team1: [{ type: String, required: true }],
    winner: { type: Number, min: 0, max: 1 },
    league: { type: Schema.ObjectId, ref: 'League'},
    season: { type: Schema.ObjectId, ref: 'Season'},
    tournament: { type: Schema.ObjectId, ref: 'Tournament'}
});

var Game = mongoose.model('Game', GameSchema);

exports.gameModel = Game;