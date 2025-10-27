const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser =require('body-parser');
require('dotenv').config();
require("./Models/db")

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(bodyParser.json())
app.use(cors());
app.use(express.static("public"));

// Root route
app.get('/', (req, res) => {
    res.send('Backend running!');
});

// /menu route
app.get('/menu', (req, res) => {
    const filePath = path.join(__dirname, 'data/Menu.json');
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

// /best route
app.get('/best', (req, res) => {
    const filePath = path.join(__dirname, 'data/Best.json');
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

// Start server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
