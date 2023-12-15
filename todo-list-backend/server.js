const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser'); // Ajout de body-parser

const app = express();
const port = 4000;

// Utilisation de body-parser pour parser le corps des requêtes
app.use(bodyParser.json());

// Configuration de la connexion MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_list',
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connecté à MySQL');
});

// Exemple de route pour obtenir toutes les tâches
app.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json(result);
        }
    });
});

// Exemple de route pour ajouter une nouvelle tâche

// Exemple de route pour ajouter une nouvelle tâche
app.post('/tasks', (req, res) => {
    const { title, completed } = req.body;
    const sql = 'INSERT INTO tasks (title, completed) VALUES (?, ?)';
    const values = [title, completed || false];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            const newTask = { id: result.insertId, title, completed };
            res.status(201).json(newTask);
        }
    });
});



// Ajoutez d'autres routes pour mettre à jour et supprimer des tâches

// Exemple de route pour mettre à jour une tâche
app.put('/tasks/:id', (req, res) => {
    const { title, completed } = req.body;
    const sql = 'UPDATE tasks SET title = ?, completed = ? WHERE id = ?';
    const values = [title, completed || false, req.params.id];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Tâche non trouvée' });
        } else {
            res.json({ id: req.params.id, title, completed });
        }
    });
});

// Exemple de route pour supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const values = [req.params.id];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Tâche non trouvée' });
        } else {
            res.json({ message: 'Tâche supprimée avec succès' });
        }
    });
});

// Lancement du serveur
app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
