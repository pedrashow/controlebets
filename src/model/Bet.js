const mongoose = require("../../env/database");
const User = require("./User");
const Currency = require("./Currency");


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
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: User,
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
	selection: {
		type: String,
		enum: ['home', 'away', 'draw', 'asianHome', 'asianAway', 'under', 'over', 'homeUnder', 'homeOver', 'awayUnder', 'awayOver', 'btts'],
		required: true,
	},
	selectionHandicap: {
		type: mongoose.Types.Decimal128,
	},
	odds: {
		type: mongoose.Types.Decimal128,
		required: true,
	},
	stake: {
		type: mongoose.Types.Decimal128,
		required: true,
	},
	stakeCurrency: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Currency',
		required: true,
	},
	stakeInEur: {
		type: mongoose.Types.Decimal128,
		required: true,
	},
	bettorResult: {
		type: mongoose.Types.Decimal128,
	}
});

BetSchema.methods.calcResult = function (homeScore, awayScore) {
	const scoreDiff = parseInt(homeScore) - parseInt(awayScore);
	const winValue = parseFloat(this.stake, 2) * parseFloat(this.odds, 2);
	const totalScore = parseInt(homeScore) + parseInt(awayScore);
	switch (this.selection) {
		case 'home':
			this.bettorResult = this.winner(scoreDiff, winValue);
			break;
		case 'away':
			this.bettorResult = this.winner(-1 * scoreDiff, winValue);
			break;
		case 'draw':
			this.bettorResult = this.draw(scoreDiff, winValue);
			break;
		case 'asianHome':
			this.bettorResult = this.asianCalc(scoreDiff, this.selectionHandicap, winValue);
			break;
		case 'asianAway':
			this.bettorResult = this.asianCalc(-1 * scoreDiff, this.selectionHandicap, winValue);
			break;
		case 'under':
			this.bettorResult = this.asianCalc(-1 * totalScore, this.selectionHandicap, winValue)
			break;
		case 'over':
			this.bettorResult = this.asianCalc(totalScore, -1 * this.selectionHandicap, winValue);
			break;
		case 'homeOver':
			this.bettorResult = this.asianCalc(homeScore, -1 * this.selectionHandicap, winValue);
			break;
		case 'homeUnder':
			this.bettorResult = this.asianCalc(-1 * homeScore, this.selectionHandicap, winValue);
			break;
		case 'awayOver':
			this.bettorResult = this.asianCalc(awayScore, -1 * this.selectionHandicap, winValue);
			break;
		case 'awayUnder':
			this.bettorResult = this.asianCalc(-1 * awayScore, this.selectionHandicap, winValue);
			break;
		case 'btts':
			this.bettorResult = this.btts(homeScore, awayScore, winValue);
			break;
	}
};

BetSchema.methods.winner = function (scoreDiff, winValue) {
	if (scoreDiff > 0)
		return winValue;
	return (-1 * this.stake);
}

BetSchema.methods.draw = function (scoreDiff, winValue) {
	if (scoreDiff === 0)
		return winValue;
	return (-1 * this.stake);
}

BetSchema.methods.asianCalc = function (score, handicap, winValue) {
	const netScore = parseFloat(score, 2) + parseFloat(handicap, 2);
	if (netScore > 0.25)
		return winValue;
	if (netScore > 0)
		return (winValue / 2);
	if (netScore === 0)
		return this.stake;
	if (netScore === -0.25)
		return (-1 * (this.stake / 2));
	return (-1 * this.stake)
}

BetSchema.methods.btts = function (home, away, winValue) {
	if (home > 0)
		if (away > 0)
			return winValue;
	return (-1 * this.stake);
}

BetSchema.methods.convertToEur = async function(value, currencyId) {
	const currency = await Currency.findById(currencyId);
	this.stakeInEur = parseFloat(parseFloat(value,2) * parseFloat(currency.rateToEur,2), 2);
}

BetSchema.pre('validate', async function(next) {
	if (this.bettorResult)
		this.bettorResult = parseFloat(this.bettorResult, 2);
	if (!this.stakeInEur)
		await this.convertToEur(this.stake, this.stakeCurrency);
	next();
});

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;