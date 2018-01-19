const express = require("express");
const fileUpload = require("express-fileupload");
const File = require("../models/file");

const router = express.Router();
router.use(fileUpload());

router.get("/:fileId", async function(req,res,next){
	try{
		let file = await File.findById(req.params.fileId);
		if (!file){
			let err = new Error("File does not exist");
			err.status = 404;
			throw err;
		}
		if (!await file.userCanView(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		req.json(file);
	}catch(err){
		next(err);
	}
});

router.get("/download/:fileId", async function(req,res,next){
	try{
		let file = await File.findById(req.params.fileId);
		if (!file){
			let err = new Error("File does not exist");
			err.status = 404;
			throw err;
		}
		if (!await file.userCanView(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		req.download(file.fileLocation, file.name, function(err){
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
		if (!req.files || !req.files.file){
			let err = new Error("No files where provided");
			err.status = 400;
			throw err;
		}
		let file = new File(req.body);
		file.owner = req.user;
		await file.saveFile(req.files.file);
		res.json(file);
	}catch(err){
		next(err);
	}
});

router.put("/:fileId", async function(req,res,next){
	try{
		let file = await File.findById(req.params.fileId);
		if (!file){
			let err = new Error("File does not exist");
			err.status = 404;
			throw err;
		}
		if (!await file.userCanEdit(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		delete req.body._id;
		delete req.body.owner;
		file.set(req.body);
		await file.save();
		res.json(file);
	}catch(err){
		next(err);
	}
});

router.delete("/:fileId", async function(req,res,next){
	try{
		let file = await File.findById(req.params.fileId);
		if (!file){
			let err = new Error("File does not exist");
			err.status = 404;
			throw err;
		}
		if (!await file.userCanEdit(req.user)){
			let err = new Error("Permission denied!");
			err.status = 401;
			throw err;
		}
		await file.remove();
		res.json({});
	}catch(err){
		next(err);
	}
});

module.exports = router;