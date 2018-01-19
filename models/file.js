const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const fs = require("fs");
const path = require("path");
const config = require("../config");
const ValidatorError = mongoose.Error.ValidatorError;

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
	return path.resolve(config.server.fileDir, this._id + "");
})

fileSchema.pre("validate", async function(next){
	const promise = new Promise(function(resolve, reject){
		fs.stat(this.fileLocation, function(err, stats){
			if (err){
				reject(err);
			}else{
				resolve(stats);
			}
		})
	}.bind(this))
	try{
		var stats = await promise;
	}catch(err){
		const props = {
			type: 'Saving error',
			message: "Error occured when saving file.",
		}
		return next (new ValidatorError(props));
	}
	this.size = stats.size;

	if (!this.populated("parent")){
		await this.populate({path:"parent"}).execPopulate();
	}
	if (!this.populated("owner")){
		await this.populate({path:"owner"}).execPopulate();
	}
	if (this.parent && !await this.parent.userCanEdit(this.owner)){
		const props = {
			type: 'Access Denied',
			message: "Access denied",
		}
		return next (new ValidatorError(props));
	}

	next();
});

fileSchema.methods.saveFile = async function(file){
	if (!this._id){
		this._id = mongoose.Types.ObjectId();
	}
	await file.mv(this.fileLocation);
	this.name = file.name;
	this.mimetype = file.mimetype;
	await this.save();
}

fileSchema.pre("remove", async function(next){
	let promise = new Promise(function(resolve, reject){
		fs.unlink(this.fileLocation, function(err){
			if (err){
				reject(err);
			}else{
				resolve();
			}
		});
	}.bind(this));
	await promise;
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