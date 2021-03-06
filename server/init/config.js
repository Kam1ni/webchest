const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const defaultServerFile = {
	host: "0.0.0.0",
	port: 3000,
	fileDir: path.resolve(__dirname, "../files"),
	db:{
		host: "localhost:27017",
		database: "webchest",
		username: null,
		password: null,
		authdb: null
	}
}

const defaultAuthFile = {
	users: [
		{username: "admin", password: "admin", isAdmin: true, _id: mongoose.Types.ObjectId()}
	],
	secret:"secret"
}

const defaultClientFile = {
	"server-endpoint": "/"
}

function createFileIfNotExist(filename, config){
	if (!fs.existsSync(path.resolve(__dirname, "../config/", filename + ".json"))){
		fs.writeFileSync(path.resolve(__dirname, "../config/", filename + ".json"), JSON.stringify(config, null, 2));
		console.log("Created config file "+ filename);
	}
}

module.exports = function(){
	if (!fs.existsSync(path.resolve(__dirname, "../config"))){
		fs.mkdirSync(path.resolve(__dirname, "../config"));
	}
	createFileIfNotExist("server", defaultServerFile);
	createFileIfNotExist("auth", defaultAuthFile);
	createFileIfNotExist("client", defaultClientFile);

	const serverConfig = require("../config/server.json");
	if (!fs.existsSync(serverConfig.fileDir)){
		fs.mkdirSync(serverConfig.fileDir);
	}
}