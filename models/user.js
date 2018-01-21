const mongoose = require("mongoose");
const mongooseBcrypt = require("mongoose-bcrypt");

const userSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true,
		hide: true,
		bcrypt: true
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false
	},
	maxSpace: {
		type: Number,
		required: true,
		default: 0
	},
	tokens:{
		type: [
			{
				token:{type: String, required: true},
				deviceName: {type: String, required: true},
			}
		],
		default: []
	}
});

userSchema.plugin(mongooseBcrypt, {rounds: 10});

userSchema.pre("validate", function(next){
	if (!this.tokens)
		this.tokens = [];
	next();
});

module.exports = mongoose.model("User", userSchema);