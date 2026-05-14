const express = require('express');
const menu = require("../data/Menu.json")

const router = express.Router();

// /best route
router.get('/menu', (req, res) => {
    try {
      return res.status(200).json(menu)
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });


module.exports = router;
