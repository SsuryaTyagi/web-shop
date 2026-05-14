const express = require("express");
const router = express.Router();
const { GetBestController } = require('../controllers/best.controller');
 
router.get("/best", GetBestController);
 
module.exports = router;