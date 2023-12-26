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

app.put('/update', (req, res) => {
    const { stateToUpdate, newTigers, newElephants, newLeopards } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        const query = 'UPDATE wildlife_population SET tigers = ?, elephants = ?, leopards = ? WHERE state = ?';
        connection.query(query, [newTigers, newElephants, newLeopards, stateToUpdate], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error executing MySQL query:', error);
                res.status(500).json({ message: 'Failed to update wildlife information' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'State not found or no changes applied' });
            } else {
                res.status(200).json({ message: 'Wildlife information updated successfully' });
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
