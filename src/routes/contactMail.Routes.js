const express = require("express");
const router = express.Router();
const { SendMailController } = require("../controllers/contact.Controller");
 
router.post("/contact", SendMailController);
 
module.exports = router;