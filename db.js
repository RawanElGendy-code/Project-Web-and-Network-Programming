// check db
const sqlite3 = require('sqlite3').verbose();

console.log('🔍 Checking database connection...');


const db = new sqlite3.Database('healthcare.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('❌ Cannot open database:', err.message);
        console.log('\n📌 Please check:');
        console.log('   1. Is healthcare.db in the same folder?');
        console.log('   2. Run: node init-db.js first');
        return;
    }
    
    console.log('✅ Connected to healthcare.db');
    

    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error('❌ Error getting tables:', err.message);
        } else {
            console.log('\n📊 Database Tables:');
            tables.forEach(table => {
                console.log(`   - ${table.name}`);
                
                
                db.all(`SELECT * FROM ${table.name} LIMIT 5`, [], (err, rows) => {
                    if (!err && rows.length > 0) {
                        console.log(`\n     Data in ${table.name}:`);
                        rows.forEach(row => {
                            console.log(`       ${JSON.stringify(row)}`);
                        });
                    }
                });
            });
        }
        
     
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
            } else {
                console.log('\n✅ Database check completed');
            }
        });
    });
});