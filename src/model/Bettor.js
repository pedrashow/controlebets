const mongoose = require("../../env/database");

const BettorSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true,
		index: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	firstName: String,
	lastName: String,
	isBookie: {
		type: Boolean,
		default: false,
		index: true
	},
	favCurrency: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Currency',
	},
	bets: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bet',
	}]
});

const Bettor = mongoose.model('Bettor', BettorSchema);

module.exports = Bettor;