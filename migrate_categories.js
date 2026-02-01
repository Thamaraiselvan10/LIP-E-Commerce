const db = require('./server/database/db');

console.log('Running migration: Create categories table');

try {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `).run();
    console.log('Migration successful');
} catch (error) {
    console.error('Migration failed:', error);
}
