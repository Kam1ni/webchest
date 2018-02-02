const init = require("./init/init");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

init().then(function(){
	console.log("Initialised")
	const config = require("./config");
	const app = express();

	const auth = require("./middlewares/auth");
	
	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use("/auth", require("./routes/auth"));
	app.use("/dir", auth.authenticate, require("./routes/directory"));
	app.use("/file", auth.authenticate, require("./routes/file"));
	app.use("/user", auth.authenticate, auth.admin, require("./routes/user"));

	app.use(function(err, req,res,next){
		console.error(err.message);
		console.error(err.stack);
		res.status(err.status || 500).json({message: err.message});
	});

	app.use("/", express.static("public"));
	app.all("/", function(req,res){
		res.sendFile("./public/index.html");
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