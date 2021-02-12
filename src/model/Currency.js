const mongoose = require("../../env/database");

const CurrencySchema = new mongoose.Schema ({
	code: {
		type : String,
		required: true,
		maxLength: 3,
		uppercase: true,
	},
	rateToEur: {
		type: Schema.Types.Decimal128,
		default: 1,
	}
});

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;