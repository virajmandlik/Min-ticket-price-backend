const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 7000;
const {minCostTickets} =require('./utils/algorithm')
// Middleware
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "", // Use your MySQL root password here
    database: "PasswordManager",
    port: "3306"
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
});


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/calculate', (req, res) => {
    const { days, costs } = req.body;

    if (!days || !costs) {
        return res.status(400).send({ error: "Invalid input" });
    }

    const result = minCostTickets(days, costs); // Your calculation logic here

    const sql = `INSERT INTO tickets (days, costs, result) VALUES (?, ?, ?)`;
    db.query(sql, [JSON.stringify(days), JSON.stringify(costs), result], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            return res.status(500).send({ error: "Database error", details: err });
        }

        return res.send({ result: result, id: result.insertId });
    });
});


app.get('/history', (req, res) => {
    const sql = 'SELECT * FROM tickets ORDER BY created_at DESC';

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("Error fetching history from database:", err);
            return res.status(500).send({ error: "Database error", details: err });
        }

        return res.send({ history: rows });
    });
});


app.get('/test', (req, res) => {
    res.send('Test route working!');
});


app.get('/test', (req, res) => {
    res.send('Test route working!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
