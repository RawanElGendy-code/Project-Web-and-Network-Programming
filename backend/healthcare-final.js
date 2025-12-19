
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080; 
const cors = require('cors');

console.log('🚀 Starting Healthcare Platform on port', PORT);

// Middleware
app.use(express.json());
app.use(cors()); 
app.use(express.json());

// Serve Frontend files
app.use(express.static(path.join(__dirname, '../Front end')));

// Simple in-memory database
let users = [
    { id: 1, name: 'Ahmed Mohamed', role: 'patient' },
    { id: 2, name: 'Sara Ali', role: 'patient' },
    { id: 3, name: 'Dr. Alaa Kotb', role: 'doctor' },
    { id: 4, name: 'Dr. Yasmin Samy', role: 'doctor' }
];

let appointments = [
    { id: 1, patient_name: 'Ahmed Mohamed', doctor_name: 'Dr. Alaa Kotb', time: '10:00', type: 'online' },
    { id: 2, patient_name: 'Sara Ali', doctor_name: 'Dr. Yasmin Samy', time: '14:00', type: 'clinic' }
];

// API Routes
app.get('/api', (req, res) => {
    res.json({
        project: 'Healthcare Platform',
        version: 'Final',
        message: 'Frontend + Backend working together!',
        endpoints: ['/api/health', '/api/users', '/api/appointments']
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        server: 'Node.js + Express',
        port: PORT,
        frontend: 'Integrated',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});


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
                error: 'Database error' 
            });
        }
        
        if (user) { 

            res.json({
                success: true,
                message: `Welcome back ${username}!`,
                user: user
            });
        } else {
            //add new user
            db.run(
                'INSERT INTO users (name, role) VALUES (?, ?)',
                [username, role],
                function(err) {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            error: 'Failed to create user' 
                        });
                    }
                    
                    const newUser = {
                        id: this.lastID,
                        name: username,
                        role: role
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


// All other routes go to Frontend (Error 404)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front end/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('✅ HEALTHCARE PLATFORM - READY FOR DEMO!');
    console.log('='.repeat(50));
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 Backend APIs:`);
    console.log(`   • Health:  http://localhost:${PORT}/api/health`);
    console.log(`   • Users:   http://localhost:${PORT}/api/users`);
    console.log(`   • API Docs: http://localhost:${PORT}/api`);
    console.log('='.repeat(50));
    console.log('📁 Frontend folder: ../Front end/');
    console.log('📁 This file: healthcare-final.js');
    console.log('='.repeat(50));
});