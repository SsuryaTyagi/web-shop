const express = require("express");
const router = express.Router();
const { SendMailController } = require("../Controllers/Contact.controller");
 
router.post("/contact", SendMailController);
 
module.exports = router;