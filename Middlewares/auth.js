const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");

const userAuth = (req, res, next)=>{
    
    console.log("Cookies received on server:", req.cookies);

    // verify JWT token
    jwt.verify(req.cookies.token, process.env.JWT_TOKEN_SECRET,(err, decoded) =>{
        if (err) {
          return res.status(401).json({ message: 'Unauthorized access!!!' });
        }
        UserModel.findOne({ email: decoded.email }).then((user)=>{
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        }).catch((err)=>{
             res.status(500).json({
              message: 'Error fetching user',
              error: err
            });
        })

});
}

module.exports = {
    userAuth
};