const mongoose = require("../../env/database");

const EventSchema = new mongoose.Schema({
	market: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Market',
		require: true
	},
	competition: {
		type: String,
	},
	date: {
		type : Date,
	},
	homeTeam: {
		type: String,
		required: true,
	},
	awayTeam: {
		type: String,
		required: true,
	},
	scoreHomeTeam: {
		type: Number,
	},
	scoreAwayTeam: {
		type: Number,
	},
	bets: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bet',
	}]
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;