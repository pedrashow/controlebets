const mongoose = require("../../env/database");

const UserSchema = new mongoose.Schema ({
	nickname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;