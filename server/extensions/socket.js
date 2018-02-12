const socketIo = require("socket.io");
const EventBus = require("./event-bus");
const Dir = require("../models/directory");
const File = require("../models/file");
const User = require("../models/user");

module.exports = function(server){
	const io = socketIo(server);
	const dirSubs = [];

	EventBus.on("dir", function(e){
		let subed = dirSubs.filter((sub)=>{
			if (e.doc.equals(sub.id)) return true;
			if (e.doc.parent && e.doc.parent.equals(sub.id)) return true;
			return false;
		});
		for (let sub of subed){
			sub.client.emit(e);
		}
	});

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
				dirSubs.push({client, id: dir._id});
			}catch(err){
				client.emit("ERROR", err.message);
			}
		});
		client.on("unsub/d", (data)=>{
			let sub = dirSubs.find((sub)=>{
				return sub.client == client && id == data.id;
			});
			dirSubs.splice(dirSubs.indexOf(sub), 1);
		});
		client.on("disconnect", function(){
			for (let sub of dirSubs){
				if (client == sub.client){
					dirSubs.splice(dirSubs.indexOf(dirSubs), 1);
				}
			}
		});
	});
}