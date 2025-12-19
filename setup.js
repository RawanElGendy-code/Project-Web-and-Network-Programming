
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('healthcare.db');

console.log('🔧 Setting up Healthcare Database...');


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

console.log('✅ Tables created!');


const users = [
    ['Ahmed Mohamed', 'ahmed@example.com', 'patient'],
    ['Sara Ali', 'sara@example.com', 'patient'],
    ['Dr. Alaa Kotb', 'alaa@hospital.com', 'doctor'],
    ['Dr. Yasmin Samy', 'yasmin@hospital.com', 'doctor']
    
];

const appointments = [
    ['Ahmed Mohamed', 'Dr. Alaa Kotb', '10:00', 'online'],
    ['Sara Ali', 'Dr. Yasmin Samy', '14:00', 'clinic']
];


users.forEach(user => {
    db.run(
        'INSERT OR IGNORE INTO users (name, email, role) VALUES (?, ?, ?)',
        user,
        (err) => {
            if (err) console.error('❌ User error:', err.message);
            else console.log(`✅ User: ${user[0]}`);
        }
    );
});


appointments.forEach(app => {
    db.run(
        'INSERT OR IGNORE INTO appointments (patient_name, doctor_name, time, type) VALUES (?, ?, ?, ?)',
        app,
        (err) => {
            if (err) console.error('❌ Appointment error:', err.message);
            else console.log(`✅ Appointment: ${app[0]} with ${app[1]}`);
        }
    );
});

console.log('\n🎉 Database setup complete!');
console.log('Run: node server.js');

db.close();