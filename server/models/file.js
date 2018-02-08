const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const fs = require("fs");
const path = require("path");
const serverConfig = require("../config/server.json");
const util = require("util");
const fsStat = util.promisify(fs.stat);
const fsUnlink = util.promisify(fs.unlink);

const fileSchema = new mongoose.Schema({
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
	},
	size: {
		type: Number,
		required: true
	},
	mimetype: {
		type: String,
		required: true
	}
});

fileSchema.virtual("fileLocation").get(function(){
	return path.resolve(serverConfig.fileDir, this._id + "");
});

fileSchema.pre("validate", async function(next){
	try{
		var stats = await fsStat(this.fileLocation);
	}catch(err){
		return next (new Error("Error occured while saving file"));
	}
	this.size = stats.size;

	if (!this.populated("parent")){
		await this.populate({path:"parent"}).execPopulate();
	}
	if (!this.populated("owner")){
		await this.populate({path:"owner"}).execPopulate();
	}
	if (this.parent && !await this.parent.userCanEdit(this.owner)){
		return next (new Error("Access Denied"));
	}

	next();
});

fileSchema.methods.saveFile = async function(file){
	if (!this._id){
		this._id = mongoose.Types.ObjectId();
	}
	await file.mv(this.fileLocation);
	this.name = file.name || this.name;
	this.mimetype = file.mimetype || this.mimetype;
	await this.save();
}

fileSchema.pre("remove", async function(next){
	await fsUnlink(this.fileLocation);
	next();
});

fileSchema.methods.userCanView = async function(user){
	if (this.owner.equals(user._id)){
		return true;
	}
	return false;
}

fileSchema.methods.userCanEdit = async function(user){
	if (this.owner.equals(user._id)){
		return true;
	}
	return false;
}


module.exports = File = mongoose.model("File", fileSchema);