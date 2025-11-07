const express = require("express");
let jwt = require("jsonwebtoken");


const router = express.router();

router.get("/verify",(req,res)=>{
    const token =  req.cooki.token;
     
    //token check 
    if (!token) return res.state(401).json({message:"No tocken found"})
        try {
            const decoded = jwt.verify(token,process.env.JWT_TOKEN_SECRET);
            res.json({message:"User verify", user:decoded});
        } catch (error) {
            console.error("Invalid or expired token", error);
            res.state(401).json({message:"Invalid or expired token"});
        }
})