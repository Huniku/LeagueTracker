var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SeasonSchema = new Schema({
    name: { type: String, required: true },
    games: [{ type: Schema.ObjectId, ref: 'Game' }],
    league: { type: Schema.ObjectId, ref: 'League' },
    tournament: [{ type: Schema.ObjectId, ref: 'Tournament' }]
});

var Season = mongoose.model('Season', SeasonSchema);

exports.seasonModel = Season;