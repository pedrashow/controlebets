const mongoose = require("../../env/database");


const BetSchema = new mongoose.Schema({
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: true,
	},
	bettor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bettor',
		required: true,
	},
	placedWhere: {
		type: String,
	},
	bookie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bettor',
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	selection:{
		type: String,
		enum: ['home','away','draw','asianHome', 'asianAway','under', 'over', 'homeUnder', 'homeOver', 'awayUnder', 'awayOver','btts'],
		required: true,
	},
	selectionHandicap:{
		type: mongoose.Types.Decimal128,
	},
	odds:{
		type: mongoose.Types.Decimal128,
		required: true,
	},
	stake:{
		type: mongoose.Types.Decimal128,
		required: true,
	},
	stakeCurrency: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Currency',
		required: true,
	},
	stakeInFavCurrency: {
		type: mongoose.Types.Decimal128,
		required: true,
	},
	isWinner: {
		type: Boolean,
	},
	returnValue: {
		type: mongoose.Types.Decimal128,
	}
});

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;