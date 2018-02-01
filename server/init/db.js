const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = async function(){
	const config = require("../config");
	const User = require("../models/user");
	await mongoose.connect(config.server.db.host + "/" + config.server.db.database);
	console.log("Connected to database");
	for (let confUser of config.auth.users){
		let user = await User.findById(confUser._id);
		if (!user){
			user = new User();
		}
		user.set(confUser);
		await user.save();
		console.log("Created user " + user.username);
	}
}
