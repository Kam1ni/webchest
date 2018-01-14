const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");

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
	}
});

module.exports = File = mongoose.model("File", fileSchema);