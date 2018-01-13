const config = require("./init/init");

config().then(function(){
	// create server
}).catch(function(err){
	console.error("An error occured and the server couldn't be started");
	console.error(err.message);
});