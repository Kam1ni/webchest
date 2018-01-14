const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const File = require("./file");

const directorySchema = new mongoose.Schema({
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
	}
});

directorySchema.methods.populateContent = async function(){
	let directories = await Directory.find({parent:this});
	let files = await File.find({parent: this});
	this.content = {
		directories,
		files
	};
}

directorySchema.methods.userCanView = async function(user){
	if (this.owner.equals(user)){
		return true;
	}
	return false;
}

directorySchema.methods.userCanEdit = async function(user){
	if (this.owner.equals(user)){
		return true;
	}
	return false;
}

directorySchema.pre("save", async function(next){
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

directorySchema.pre("remove", async function(next){
	await this.populateContent();
	for (let dir of this.content.directories){
		dir.remove();
	}
	for (let file of this.content.files){
		file.remove();
	}

	next();
});

module.exports = Directory = mongoose.model(directorySchema);