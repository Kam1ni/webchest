const express = require("express");
const Directory = require("../models/directory");
const File = require("../models/file");

const router = express.Router();

router.get("/", async function(req,res,next){
	try{
		let directories = await Directory.find({parent: null, owner:req.user});
		let files = await File.find({parent: null, owner:req.user});
		res.json({
			directories,
			files
		});
	}catch(err){
		next(err);
	}
});

router.get("/:directoryId", async function(req,res,next){
	try{
		let dir = await Directory.findById(req.params.directoryId);
		if (!dir){
			let err = new Error("Directory does not exist!");
			err.status = 404;
			throw err;
		}
		if (!await dir.userCanView(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		let content = await dir.getContent();
		res.json({...dir._doc, ...content});
	}catch(err){
		next(err);
	}
});

router.get("/download/:directoryId", async function(req,res,next){
	try{
		let dir = await Directory.findById(req.params.directoryId);
		if (!dir){
			let err = new Error("Directory does not exist!");
			err.status = 404;
			throw err;
		}
		if (!await dir.userCanView(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		let result = await dir.createZip();
		res.download(result.fileLocation, dir.name, function(err){
			result.delete();
			if (err){
				next(err);
			}
		});
	}catch(err){
		next(err);
	}
});


router.post("/", async function(req,res,next){
	try{
		let dir = new Directory(req.body);
		dir.owner = req.user;
		await dir.save();
		res.json(dir);
	}catch(err){
		next(err);
	}
});

router.put("/:directoryId", async function(req,res,next){
	try{
		let dir = await Directory.findById(req.params.directoryId);
		if (!dir){
			let err = new Error("Directory does not exist!");
			err.status = 404;
			throw err;
		}
		if (!await dir.userCanEdit(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		delete req.body._id;
		delete req.body.owner;
		dir.set(req.body);
		await dir.save();
		res.json(dir);
	}catch(err){
		next(err);
	}
});

router.delete("/:directoryId", async function(req,res,next){
	try{
		let dir = await Directory.findById(req.params.directoryId);
		if (!dir){
			let err = new Error("Directory does not exist!");
			err.status = 404;
			throw err;
		}
		if (!await dir.userCanEdit(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		await dir.remove();
		res.json({});
	}catch(err){
		next(err);
	}
});

module.exports = router;