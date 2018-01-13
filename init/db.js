const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = async function(){
	const config = require("../config");
	await mongoose.connect(config.server.db.host, {useMongoClient: true});
}
