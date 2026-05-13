const express = require("express");
const router = express.Router();
const { SendMailController } = require("../controllers/Contact.controller");
 
router.post("/contact", SendMailController);
 
module.exports = router;