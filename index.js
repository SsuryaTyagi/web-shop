const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


const app = express();
const port = 8000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
app.use(express.static("public"));

// Endpoint to get data from category.json
app.get('/menu', (req, res) => {
    // Path to category.json file
    const filePath = path.join(__dirname, 'data/Menu.json');

    // Read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse JSON data
        try {
            const Menu = JSON.parse(data);
            res.json(Menu);
            
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    app.get("/best",(req,res)=>{
         const filePath = path.join(__dirname, 'data/Best.json');
             fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse JSON data
        try {
            const Best = JSON.parse(data);
            res.json(Best);
            
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    })
});




// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
