const mongoose = require("../../env/database");

const CurrencySchema = new mongoose.Schema ({
	code: {
		type : String,
		required: true,
		maxLength: 3,
		uppercase: true,
	},
	rateToEur: {
		type: mongoose.Schema.Types.Decimal128
	}
});

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;