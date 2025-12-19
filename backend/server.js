const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;  

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./healthcare.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ Database error:', err.message);
    } else {
        console.log('✅ Connected to healthcare.db');
        createTables();
    }
});

// Create tables if not exist
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('❌ Users table error:', err.message);
        else console.log('✅ Users table ready');
    });

    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        time TEXT NOT NULL,
        type TEXT DEFAULT 'online',
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('❌ Appointments table error:', err.message);
        else console.log('✅ Appointments table ready');
    });
}

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🏥 Healthcare API',
        version: '1.0',
        endpoints: {
            users: '/users',
            appointments: '/appointments',
            health: '/health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/appointments', (req, res) => {
    db.all('SELECT * FROM appointments', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   Health:      http://localhost:${PORT}/health`);
    console.log(`   Users:       http://localhost:${PORT}/users`);
    console.log(`   Appointments: http://localhost:${PORT}/appointments`);
});