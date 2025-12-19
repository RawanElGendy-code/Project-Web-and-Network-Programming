// init-db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('healthcare.db');

console.log('🚀 Creating database tables...');

db.serialize(() => {
    
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    
    db.run(`CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        image_url TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        doctor_id INTEGER,
        appointment_time DATETIME NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('online', 'clinic')),
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id),
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    )`);

    
    console.log('📊 Adding sample data...');
    
    
    const users = [
        ['Ahmed Mohamed', 'ahmed@example.com', 'patient'],
        ['Sara Ali', 'sara@example.com', 'patient'],
        ['Dr. Alaa Kotb', 'alaa@hospital.com', 'doctor'],
        ['Dr. Yasmin Samy', 'yasmin@hospital.com', 'doctor']
    ];
    
    users.forEach(user => {
        db.run(
            'INSERT OR IGNORE INTO users (name, email, role) VALUES (?, ?, ?)',
            user,
            (err) => {
                if (err) console.error('User error:', err);
                else console.log(`User added: ${user[0]}`);
            }
        );
    });

    
    const doctors = [
        ['Dr. Alaa Kotb', 'Cardiology', 'doctor1.jpg', 'Expert cardiologist with 15 years experience'],
        ['Dr. Yasmin Samy', 'Cardiology', 'doctor2.jpg', 'Specialized in heart diseases'],
        ['Dr. Noran Hossam', 'Gastroenterology', 'doctor3.jpg', 'Digestive system specialist'],
        ['Dr. Rawan Khaled', 'Gastroenterology', 'doctor4.jpg', 'Expert in gastroenterology']
    ];
    
    doctors.forEach(doctor => {
        db.run(
            'INSERT OR IGNORE INTO doctors (name, specialty, image_url, description) VALUES (?, ?, ?, ?)',
            doctor,
            (err) => {
                if (err) console.error('Doctor error:', err);
                else console.log(`Doctor added: ${doctor[0]}`);
            }
        );
    });

   
    const appointments = [
        [1, 1, '2024-01-20 10:00:00', 'online'],
        [2, 2, '2024-01-20 14:00:00', 'clinic']
    ];
    
    appointments.forEach(app => {
        db.run(
            'INSERT OR IGNORE INTO appointments (patient_id, doctor_id, appointment_time, type) VALUES (?, ?, ?, ?)',
            app,
            (err) => {
                if (err) console.error('Appointment error:', err);
                else console.log(`Appointment added for patient ${app[0]}`);
            }
        );
    });

    console.log('✅ Database initialized successfully!');
    console.log('\n📋 Sample Data:');
    console.log('   Users: 4 (2 patients, 2 doctors)');
    console.log('   Doctors: 4');
    console.log('   Appointments: 2');
});

db.close((err) => {
    if (err) {
        console.error('❌ Error closing database:', err);
    } else {
        console.log('\n🚀 Now run: node server.js');
    }
});