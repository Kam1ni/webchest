const init = require("./init/init");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

init().then(function(){
	console.log("Creating server");
	const config = require("./config");

	const app = express();

	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use("/auth", require("./routes/auth"));

	app.all("/", function(req,res,next, err){
		console.error(err.message);
		console.error(err.stack);
		res.status(err.status || 500).text(err.message);
	});

	const httpServer = http.createServer(app);
	httpServer.listen(config.server.port, config.server.host, function(err){
		if (err){
			console.error("Could not start server");
			console.error(err.message);
			console.error(err.stack);
		}else{
			console.log("Server is running on " + config.server.host + ":" + config.server.port);
		}
	})
}).catch(function(err){
	console.error("An error occured and the server couldn't be started");
	console.error(err.message);
	console.error(err.stack);
});