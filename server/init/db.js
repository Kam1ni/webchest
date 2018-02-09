const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

function createConnectionString(dbConfig){
	let string = "mongodb://";
	if (dbConfig.username){
		string += `${dbConfig.username}:${dbConfig.password}@`;
	}
	string += `${dbConfig.host}/${dbConfig.database}`;
	if (dbConfig.authdb){
		string += "?authSource=" + dbConfig.authdb;
	}
	return string;
}

async function createUsers(){
	const authConfig = require("../config/auth.json");
	const User = require("../models/user");
	
	for (let confUser of authConfig.users){
		let user = await User.findById(confUser._id);
		if (!user){
			user = new User();
		}
		user.set(confUser);
		await user.save();
		console.log(`${user.isNew ? "Created" : "Updated"} user ${user.username}`);
	}
}

module.exports = async function(){
	const serverConfig = require("../config/server.json");
	await mongoose.connect(createConnectionString(serverConfig.db), {useMongoClient: true});
	console.log("Connected to database");
	await createUsers();
}
