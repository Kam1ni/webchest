const JWT = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config");

module.exports = {
	authenticate: async function(req,res,next){
		try{
			req.user = await User.findOne({tokens:{$elemMatch: {token: req.headers.authorization}}});
			if (!req.user){
				throw new Error("Invalid token");
			}
			next();
		}catch(err){
			console.log(err);
			err.status = 401;
			next(err);
		}
	},
	admin: async function(req,res,next){
		try{
			req.user = await User.findOne({tokens:{$elemMatch: {token: req.headers.authorization}}});
			if (!req.user){
				throw new Error("Invalid token");
			}
			if (!req.user.isAdmin){
				throw new Error("This is an admin only route");
			}
			next();
		}catch(err){
			console.log(err);
			err.status = 401;
			next(err);
		}
	}
}