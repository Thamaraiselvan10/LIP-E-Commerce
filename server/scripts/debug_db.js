const db = require('../database/db');

const products = db.prepare('SELECT id, name FROM products').all();
console.log('Products:', products);

const users = db.prepare('SELECT id, email, name FROM users').all();
console.log('Users:', users);
