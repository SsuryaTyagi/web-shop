const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// /best route
router.get('/menu', (req, res) => {
  const filePath = path.join(__dirname, '../data/Menu.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Internal Server Error');
    try {
      const Best = JSON.parse(data);
      res.json(Best);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = router;
