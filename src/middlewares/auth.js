const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.Model");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const token = headerToken || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

  
    const user = await UserModel.findOne(
      decoded.id
        ? { _id: decoded.id }
        : { email: decoded.email }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { userAuth };