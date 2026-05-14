const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                roll_number TEXT NOT NULL UNIQUE,
                course TEXT NOT NULL,
                grade TEXT
            )
        `);
    }
});

// --- API Endpoints ---

// Get all students
app.get('/api/students', (req, res) => {
    const sql = 'SELECT * FROM students ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get a single student by ID
app.get('/api/students/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(row);
    });
});

// Add a new student
app.post('/api/students', (req, res) => {
    const { name, roll_number, course, grade } = req.body;
    
    if (!name || !roll_number || !course) {
        return res.status(400).json({ error: 'Name, Roll Number, and Course are required fields.' });
    }

    const sql = 'INSERT INTO students (name, roll_number, course, grade) VALUES (?, ?, ?, ?)';
    const params = [name, roll_number, course, grade];
    
    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Roll number already exists.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, roll_number, course, grade });
    });
});

// Update a student
app.put('/api/students/:id', (req, res) => {
    const id = req.params.id;
    const { name, roll_number, course, grade } = req.body;
    
    if (!name || !roll_number || !course) {
        return res.status(400).json({ error: 'Name, Roll Number, and Course are required fields.' });
    }

    const sql = 'UPDATE students SET name = ?, roll_number = ?, course = ?, grade = ? WHERE id = ?';
    const params = [name, roll_number, course, grade, id];
    
    db.run(sql, params, function(err) {
        if (err) {
             if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Roll number already exists.' });
            }
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ id: Number(id), name, roll_number, course, grade });
    });
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM students WHERE id = ?';
    
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully', changes: this.changes });
    });
});

// Start the server
app.listen(PORT, "0.0.0.0",() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
