var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LeagueSchema = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    admins: [{type: Schema.ObjectId, ref: 'User' }],
    players: [{type: Schema.ObjectId, ref: 'User' }],
    games: [{ type: Schema.ObjectId, ref: 'Game' }],
    season: [{ type: Schema.ObjectId, ref: 'Season' }],
    tournament: [{ type: Schema.ObjectId, ref: 'Tournament' }]
});

var League = mongoose.model('League', LeagueSchema);

exports.leagueModel = League;