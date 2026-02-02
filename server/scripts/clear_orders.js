const db = require('../database/db');

console.log('Clearing orders and order_items...');
db.prepare('DELETE FROM order_items').run();
db.prepare('DELETE FROM orders').run();
// Also reset sequence if desired, but not strictly necessary for samples
db.prepare("DELETE FROM sqlite_sequence WHERE name='orders' OR name='order_items'").run();

console.log('Orders cleared.');
