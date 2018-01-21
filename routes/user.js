const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/", async function(req,res,next){
	try{
		let users = await User.find({}).select("-tokens").select("-password");
		res.json(users)
	}catch(err){
		next(err);
	}
});

module.exports = router;