const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('healthcare.db');

db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL
    )`);

    // Appointments table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        type TEXT
    )`);

    console.log('Database initialized with tables.');
});

db.close();
