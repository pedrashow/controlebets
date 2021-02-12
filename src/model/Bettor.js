const mongoose = require("../../env/database");

const BettorSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true,
	},
	firstName: String,
	lastName: String,
	isCustomer: {
		type: Boolean,
		default: true,
	},
	isBookie: {
		type: Boolean,
		default: false,
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