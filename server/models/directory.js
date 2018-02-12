const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const EventBus = require("../extensions/event-bus");

const File = require("./file");
const serverConfig = require("../config/server.json");
const ValidatorError = mongoose.Error.ValidatorError;

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		validate:{
			validator: function(val){
				return val.length > 0;
			},
			message: 'name may not be an empty string'
		}
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Directory",
		default: null
	}
});

schema.methods.getContent = async function(){
	let directories = await Directory.find({parent:this});
	let files = await File.find({parent: this});
	return {directories, files}
}

schema.methods.userCanView = async function(user){
	if (this.owner.equals(user._id)){
		return true;
	}
	return false;
}

schema.methods.userCanEdit = async function(user){
	if (this.owner.equals(user._id)){
		return true;
	}
	return false;
}

schema.pre("validate", async function(next){
	let populatedFields = [];
	if (!this.populated("parent")){
		await this.populate("parent").execPopulate();
	}
	if (!this.populated("owner")){
		await this.populate("owner").execPopulate();
	}
	if (this.parent && !await this.parent.userCanEdit(this.owner)){
		return next (new Error("Access Denied"));
	}

	if (this.equals(this.parent)){
		const props = {
			type: 'invalid parent',
			message: "Parent can not be the same object",
			path: 'parent',
			value: this.parent
		}
		return next (new ValidatorError(props));
	}

	let parent = this.parent;
	while (parent != null){
		await parent.populate({path: 'parent'}).execPopulate();
		parent = parent.parent;
		if (this.equals(parent)){
			const props = {
			type: 'invalid parent',
			message: "Infinite directory loop",
			path: 'parent',
			value: this.parent
		}
		return next (new ValidatorError(props));
		}
	}
	next();
});

schema.methods.createZip = async function(){
	let promise = new Promise(async (resolve, reject)=>{
		let fileName = path.join(serverConfig.fileDir, this._id + "-" + new Date().getTime() + ".zip");
		let output = fs.createWriteStream(fileName);
		let archive = archiver('zip', {
			zlib:{level: 0}
		});
		archive.on('error', (err)=>{
			reject(err);
		});
		output.on('close', ()=>{
			resolve({fileLocation: fileName, delete: function(){
				fs.unlink(fileName, (err)=>{if(err) console.error(err.message)});
			}});
		});
		archive.on('warning', (err)=>{
			if (err.code == 'ENOENT'){
				console.log(err.message);
			}else{
				reject(err);
			}
		});
		archive.pipe(output);
		let content = await this.getContent();
		function handleFiles(files, parentDir){
			for (let file of files){
				archive.append(fs.createReadStream(file.fileLocation), {name: parentDir + "/" + file.name});
			}
		}
		async function handleDirectories(directories, parentDir){
			for (let dir of directories){
				let thisDirContent = await dir.getContent();
				handleFiles(thisDirContent.files, parentDir + "/" + dir.name);
				await handleDirectories(thisDirContent.directories, parentDir + "/" + dir.name);
			}
		}
		handleFiles(content.files, this.name);
		await handleDirectories(content.directories, this.name);
		archive.finalize();
	});
	return await promise;
}

schema.pre("remove", async function(next){
	let content = await this.getContent();
	for (let dir of content.directories){
		dir.remove();
	}
	for (let file of content.files){
		file.remove();
	}

	next();
});

schema.post("remove", async function(doc){
	EventBus.emit("dir", {event:"remove", doc});
});

schema.post("save", async function(doc){
	console.log("post save");
	EventBus.emit("dir", {event:"update", doc});
});

module.exports = Directory = mongoose.model("Directory", schema);