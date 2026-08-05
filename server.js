const app = require("./src/app");
const MongoConnection = require("./src/config/db");

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await MongoConnection();
    isConnected = true;
  }
  return app(req, res);
};