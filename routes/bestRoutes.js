const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// /menu route
router.get('/best', (req, res) => {
  const filePath = path.join(__dirname, '../data/Best.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Internal Server Error');
    try {
      const Menu = JSON.parse(data);
      res.json(Menu);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = router;
