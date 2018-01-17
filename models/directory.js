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
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
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
	if (this.owner.equals(user._id)){
		return true;
	}
	return false;
}

directorySchema.methods.userCanEdit = async function(user){
	if (this.owner.equals(user._id)){
		return true;
	}
	return false;
}

directorySchema.pre("validate", async function(next){
	let promise;
	if (!this.populated("parent")){
		promise = this.populate({path:"parent"});
	}
	if (!this.populated("owner")){
		promise.populate({path:"owner"});
	}
	await promise.execPopulate();
	if (this.parent && !await this.parent.userCanEdit(this.owner)){
		throw new Error("Access denied");
	}

	if (this.equals(this.parent)){
		throw new Error("Parrent can not be the same object");
	}

	let parent = this.parent;
	while (parent != null){
		await parent.populate({path: parent}).execPopulate();
		parent = parent.parent;
		if (parent.equals(this)){
			throw new Error("Infinite directory loop");
		}
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

module.exports = Directory = mongoose.model("Directory", directorySchema);