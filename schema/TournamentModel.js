var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TournamentSchema = new Schema({
    name: { type: String, required: true },
    admins: [{type: Schema.ObjectId, ref: 'User' }],
    games: [{ type: Schema.ObjectId, ref: 'Game' }],
    players: [{type: Schema.ObjectId, ref: 'User' }]
});

var Tournament = mongoose.model('Tournament', TournamentSchema);

exports.tournamentModel = Tournament;