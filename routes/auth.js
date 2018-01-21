const express = require("express");
const JWT = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user");
const mAuth = require("../middlewares/auth");

const router = express.Router();

router.get("/", mAuth.authenticate, async function(req,res,next){
	res.json(req.user);
});

router.post("/login", async function(req, res, next){
	try{
		let user = await User.findOne({username: req.body.username});
		if (!user){
			throw new Error("Invalid login");
		}
		let valid = await user.verifyPassword(req.body.password);
		if (!valid){
			throw new Error("Invalid login");
		}
		let token = JWT.sign({userId: user._id, date: new Date()} , config.auth.secret);
		let deviceName = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + " at " + new Date().toLocaleDateString()
		user.tokens.push({token, deviceName});
		await user.save();
		res.json({token});
	}catch(err){
		err.status = 401;
		next(err);
	}
});

router.patch("/password", mAuth.authenticate, async function(req,res,next){
	try{
		let valid = await req.user.verifyPassword(req.body.oldPassword);
		if (!valid){
			throw new Error("Old password is wrong");
		}
		req.user.password = req.body.newPassword;
		await req.user.save();
		res.json({message:"Password changed"});
	}catch(err){
		err.status = 400;
		next(err);
	}
});

router.delete("/logout", mAuth.authenticate, async function(req,res,next){
	try{
		req.user.tokens.splice(req.user.tokens.indexOf(req.headers.authorization), 1);
		await req.user.save();
		res.json({});
	}catch(err){
		next(err);
	}
});

router.delete("/logout/:token", mAuth.authenticate, async function(req,res,next){
	try{
		let index = null;
		for (let i in req.user.tokens){
			if (req.user.tokens[i].token == req.params.token)
				index = i;
		}
		if (index){
			req.user.tokens.splice(index, 1);
		}
		await req.user.save();
		res.json(req.user);
	}catch(err){
		next(err);
	}
});

module.exports = router;
