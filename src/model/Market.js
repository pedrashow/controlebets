const mongoose = require("../../env/database");

const MarketSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
	}
});

const Market = mongoose.model('Market', MarketSchema);

module.exports = Market;