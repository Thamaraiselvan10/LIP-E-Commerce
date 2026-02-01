const db = require('./server/database/db');

console.log('--- Order Stats Analytics Debug ---');

const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
console.log('Total Orders:', totalOrders);

const totalRevenue = db.prepare('SELECT SUM(total) as sum FROM orders WHERE payment_status = ?').get('completed').sum || 0;
console.log('Total Revenue (completed):', totalRevenue);

const pendingOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('pending').count;
console.log('Pending Orders:', pendingOrders);

const completedOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('delivered').count;
console.log('Completed Orders:', completedOrders);

// Breakdown
console.log('\n--- Status Breakdown ---');
const statusBreakdown = db.prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status').all();
console.table(statusBreakdown);

console.log('\n--- Payment Status Breakdown ---');
const paymentStatusBreakdown = db.prepare('SELECT payment_status, COUNT(*) as count, SUM(total) as revenue FROM orders GROUP BY payment_status').all();
console.table(paymentStatusBreakdown);

console.log('\n--- Orders Data ---');
const allOrders = db.prepare('SELECT id, total, status, payment_status FROM orders LIMIT 10').all();
console.table(allOrders);
