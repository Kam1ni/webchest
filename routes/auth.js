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
		if (!valid){
			throw new Error("Invalid login");
		}
		let valid = await user.verifyPassword(req.body.password);
		if (!valid){
			throw new Error("Invalid login");
		}
		let token = JWT.sign({userId: user._id, date: new Date()} , config.auth.secret);
		user.tokens.push(token);
		await user.save();
		res.json({token});
	}catch(err){
		err.status = 401;
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

module.exports = router;
