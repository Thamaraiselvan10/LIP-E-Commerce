const db = require('../database/db');

const orderCount = db.prepare('SELECT count(*) as count FROM orders').get().count;
console.log('Order Count:', orderCount);

const orders = db.prepare('SELECT * FROM orders').all();
console.log('Orders:', orders);

const items = db.prepare('SELECT * FROM order_items').all();
console.log('Order Items:', items);
