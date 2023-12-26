const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: '34.42.223.162',
    user: 'harini',
    password: 'Harini0808',
    database: 'wildlife'
});

app.post('/store', (req, res) => {
    const { state, tigers, elephants, leopards } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        const query = 'INSERT INTO wildlife_population (state, tigers, elephants, leopards) VALUES (?, ?, ?, ?)';
        connection.query(query, [state, tigers, elephants, leopards], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error executing MySQL query:', error);
                res.status(500).json({ message: 'Failed to store wildlife information' });
                return;
            }

            res.status(200).json({ message: 'Wildlife information stored successfully' });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
