const express = require('express');
const router = express.Router();

// ✅ Direct JSON import
const Best = require('../data/Best.json');

// /best route
router.get('/best', (req, res) => {
  try {
    res.json(Best);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
