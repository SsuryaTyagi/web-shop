const express = require('express');
const router = express.Router();

// ✅ Direct JSON import (Vercel compatible)
const Menu = require('../data/Menu.json');

// /menu route
router.get('/menu', (req, res) => {
  try {
    res.json(Menu);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
