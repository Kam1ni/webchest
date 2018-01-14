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

module.exports = Directory = mongoose.model(directorySchema);