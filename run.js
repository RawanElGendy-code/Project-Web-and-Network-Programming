
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Front end')));

// Database setup
const db = new sqlite3.Database('healthcare.db');


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
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
    
    console.log('✅ Database tables ready');
});

// ========== API ROUTES ==========
// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        server: 'Healthcare Backend',
        timestamp: new Date().toISOString()
    });
});

// Login API
app.post('/api/login', (req, res) => {
    const { username, role } = req.body;
    
    if (!username || !role) {
        return res.status(400).json({ 
            success: false, 
            error: 'Username and role required' 
        });
    }
    
    db.get('SELECT * FROM users WHERE name = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                error: 'Database error: ' + err.message 
            });
        }
        
        if (user) {
            // User exists
            res.json({
                success: true,
                message: `Welcome back ${username}!`,
                user: user
            });
        } else {
            // Create new user
            db.run(
                'INSERT INTO users (name, role) VALUES (?, ?)',
                [username, role],
                function(err) {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            error: 'Failed to create user: ' + err.message 
                        });
                    }
                    
                    const newUser = {
                        id: this.lastID,
                        name: username,
                        role: role,
                        created_at: new Date().toISOString()
                    };
                    
                    res.json({
                        success: true,
                        message: `New user created: ${username}`,
                        user: newUser
                    });
                }
            );
        }
    });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
    db.all('SELECT * FROM appointments ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
    const { patient_name, doctor_name, time, type } = req.body;
    
    if (!patient_name || !doctor_name || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.run(
        'INSERT INTO appointments (patient_name, doctor_name, time, type) VALUES (?, ?, ?, ?)',
        [patient_name, doctor_name, time, type || 'online'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ 
                    id: this.lastID,
                    message: 'Appointment created successfully'
                });
            }
        }
    );
});

// Frontend route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front end/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Healthcare Platform Running:`);
    console.log(`   🌐 Frontend: http://localhost:${PORT}`);
    console.log(`   🔗 Backend API: http://localhost:${PORT}/api`);
    console.log(`   👤 Login API: POST http://localhost:${PORT}/api/login`);
    console.log(`   📅 Appointments: GET http://localhost:${PORT}/api/appointments`);
    console.log(`\n📁 Frontend folder: ../Front end/`);
});