const config = require("./config");
const db = require("./db");

module.exports = async function(){
	config();
	await db();
};