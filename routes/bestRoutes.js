const express = require("express");
const router = express.Router();
const { GetBestController } = require('../Controllers/Best.controller');
 
router.get("/best", GetBestController);
 
module.exports = router;