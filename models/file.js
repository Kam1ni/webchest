const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const fs = require("fs");
const path = require("path");
const config = require("../config");

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
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "User"
	},
	parent: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "Directory"
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
	return Path.resolve(config.server.fileDir, this._id);
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
	let stats = await promise;
	this.size = stats.size;

	if (!this.populated("parent")){
		await File.populate(this, {path:"parent"});
	}
	if (!this.populated("owner")){
		await File.populate(this, {path:"owner"});
	}
	if (!await this.parent.userCanEdit(this.owner)){
		throw new Error("Access denied");
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
	await file.save();
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
	});
	await promise;
	next();
});

module.exports = File = mongoose.model("File", fileSchema);