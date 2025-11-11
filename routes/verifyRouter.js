const express = require("express");
let jwt = require("jsonwebtoken");


const router = express.Router();

router.get("/verify",(req,res)=>{
    // console.log("Cookies received:", req.cookies);
    const token =  req.cookies.token;
    
     
    //token check 
    if (!token) return res.status(401).json({ message: "No token found" });
        try {
            const decoded = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
            res.json({message:"User verify", user:decoded});
        } catch (error) {
            console.error("Invalid or expired token", error);
            res.status(401).json({message:"Invalid or expired token"});
        }
});

module.exports = router;