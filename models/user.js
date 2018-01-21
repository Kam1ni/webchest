const mongoose = require("mongoose");
const mongooseBcrypt = require("mongoose-bcrypt");
const Dir = require("./directory");
const File = require("./file");

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

userSchema.pre("remove", async function(next){
	let directories = await Directory.find({parent: null, owner:this});
	let files = await File.find({parent: null, owner:this});
	for (let dir of directories){
		await dir.remove();
	}
	for (let file of files){
		await file.remove();
	}
	next();
});

module.exports = mongoose.model("User", userSchema);