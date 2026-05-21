const best = require("../data/Best.json")

const GetBestController = (req, res) => {
  return res.status(200).json(best); 
};


module.exports = { GetBestController };