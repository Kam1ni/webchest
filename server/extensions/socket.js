const socketIo = require("socket.io");
const EventBus = require("./event-bus");
const Dir = require("../models/directory");
const File = require("../models/file");
const User = require("../models/user");

module.exports = function(server){
	const io = socketIo(server);
	const subs = [];

	io.on("connection", function(client){
		client.on("sub/d", async (data)=>{
			try{
				let dir = await Dir.findById(data.id);
				let user = await User.findOne({tokens:{$elemMatch: {token: req.headers.authorization}}});
				if (!user){
					throw new Error("Invalid token");
				}
				if (!await dir.userCanView(user)){
					throw new Error("Permission denied");
				}
				subs.push({client, dirId: dir._id});
			}catch(err){
				client.emit("ERROR", err.message);
			}
		});
		client.on("unsub/d", (data)=>{
			let sub = subs.find((sub)=>{
				return sub.client == client && dirId == data.id;
			});
			subs.splice(subs.indexOf(sub), 1);
		});
		client.on("disconnect", function(){
			for (let sub of subs){
				if (client == sub.client){
					subs.splice(subs.indexOf(subs), 1);
				}
			}
		});
	});
}