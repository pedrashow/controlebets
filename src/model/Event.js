const mongoose = require("../../env/database");

const EventSchema = new mongoose.Schema({
	market: {
		type: String,
	},
	competition: {
		type: String,
	},
	date: {
		type: Date,
		required: true,
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