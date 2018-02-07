const express = require("express");
const config = require("../config/client.json");

const router = express.Router();

router.get("/", async function(req,res,next){
	res.json(config);
});

module.exports = router;