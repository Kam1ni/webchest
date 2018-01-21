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

router.get("/:userId", async function(req,res,next){
	try{
		let user = await User.findById(req.params.userId).select("-tokens").select("-password");
		if (!user){
			let err = new Error("User not found");
			err.status = 404;
			throw err;
		}
		res.json(user)
	}catch(err){
		next(err);
	}
});

router.post("/", async function(req,res,next){
	try{
		let user = new User(req.body);
		await user.save();
		res.json(user);
	}catch(err){
		next(err);
	}
});

router.put("/:userId", async function(req,res,next){
	try{
		let user = await User.findById(req.params.userId).select("-tokens").select("-password");
		if (!user){
			let err = new Error("User not found");
			err.status = 404;
			throw err;
		}
		user.set(req.body);
		await user.save();
		res.json(user);
	}catch(err){
		next(err);
	}
});

router.delete("/:userId", async function(req,res,next){
	try{
		let user = await User.findById(req.params.userId).select("-tokens").select("-password");
		if (!user){
			let err = new Error("User not found");
			err.status = 404;
			throw err;
		}
		await user.remove();
		res.json({});
	}catch(err){
		next(err);
	}
});

module.exports = router;