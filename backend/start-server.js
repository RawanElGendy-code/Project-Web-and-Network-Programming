// start-server.js - Backend with Frontend serving
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); 

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../Front end')));

// Database setup
const db = new sqlite3.Database('healthcare.db');

// Create tables and sample data
db.serialize(() => {
    console.log('🔧 Setting up database...');
    
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        time TEXT NOT NULL,
        type TEXT DEFAULT 'online',
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    console.log('✅ Database ready');
});

// ========== API ROUTES ==========
app.get('/api', (req, res) => {
    res.json({
        project: 'Healthcare Platform',
        version: '2.0',
        endpoints: {
            users: '/api/users',
            appointments: '/api/appointments',
            health: '/api/health'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        message: 'Backend is running with frontend',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

app.get('/api/appointments', (req, res) => {
    db.all('SELECT * FROM appointments', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// Add a new user
app.post('/api/users', (req, res) => {
    const { name, role } = req.body;
    if (!name || !role) {
        return res.status(400).json({ error: 'Name and role required' });
    }
    
    db.run(
        'INSERT INTO users (name, role) VALUES (?, ?)',
        [name, role],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ 
                    id: this.lastID, 
                    name, 
                    role,
                    message: 'User added successfully' 
                });
            }
        }
    );
});

// ========== FRONTEND SERVING ==========
// All other routes go to frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front end/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Healthcare Platform (Full Stack):`);
    console.log(`   Frontend: http://localhost:${PORT}`);
    console.log(`   Backend API: http://localhost:${PORT}/api`);
    console.log(`   Users API: http://localhost:${PORT}/api/users`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`\n📁 Frontend folder: ../Front end/`);
    console.log(`📁 Backend folder: ./`);
});