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
	stakeInEur: {
		type: mongoose.Types.Decimal128,
		required: true,
	},
	bettorResult: {
		type: mongoose.Types.Decimal128,
	}
});

BetSchema.methods.calcResult = function (homeScore,awayScore) {
	const scoreDiff = parseInt(homeScore) - parseInt(awayScore);
	const awayDiff = -1 * scoreDiff;
	const winValue = parseFloat(this.stake) * parseFloat(this.odds);
	const totalScore = parseInt(homeScore) + parseInt (awayScore);
	switch (this.selection) {
		case 'home':
			this.bettorResult = this.winner(scoreDiff, winValue);
			break;
		case 'away':
			this.bettorResult = this.winner(awayDiff, winValue);
			break;
		case 'draw':
			this.bettorResult = this.draw(scoreDiff, winValue);
			break;
		case 'asianHome':
			this.bettorResult = this.asianCalc(scoreDiff, this.handicap, winValue);
			break;
		case 'asianAway':
			this.bettorResult = this.asianCalc(awayDiff, this.handicap, winValue);
			break;
		case 'under':
			let score = -1 * totalScore;
			this.bettorResult = this.asianCalc(score, this.handicap, winValue)
			break;
		case 'over':
			let handicap = -1 * this.handicap;
			this.bettorResult = this.asianCalc(totalScore, handicap, winValue);
			break;
		case 'homeOver':
			handicap = -1 * this.handicap;
			this.bettorResult = this.asianCalc(homeScore, handicap, winValue);
			break;
		case 'homeUnder':
			score = -1 * homeScore;
			this.bettorResult = this.asianCalc(score, this.handicap, winValue);
			break;
		case 'awayOver':
			handicap = -1 * this.handicap;
			this.bettorResult = this.asianCalc(awayScore, handicap, winValue);
			break;
		case 'awayUnder':
			score = -1 * awayScore;
			this.bettorResult = this.asianCalc(score, this.handicap, winValue);
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
	const netScore = score + handicap;
	if (netScore > 0.25)
		return winValue;
	if (netScore > 0)
		return (winValue / 2);
	if (netScore === 0)
		return this.stake;
	if (netScore === -0.25)
		return (-1 * (this.stake / 2));
	return (-1* this.stake)
}

BetSchema.methods.btts = function (home, away, winValue) {
	if (home > 0)
		if (away > 0)
			return winValue;
	return (-1 * this.stake);
}

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;