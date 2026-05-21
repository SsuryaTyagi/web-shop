const jwt = require("jsonwebtoken");

const generateVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_TOKEN_SECRET, { expiresIn: "1d" });
};

const verifyVerificationToken = (token) => {
  return jwt.verify(token, process.env.JWT_TOKEN_SECRET);
};

module.exports = { generateVerificationToken, verifyVerificationToken };
