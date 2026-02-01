const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'server/database/ecommerce.db');
const db = new Database(dbPath);

function runTest() {
    console.log('--- Starting Stock Deduction Test ---');

    // 1. Create a Test User
    const userEmail = `test_stock_${Date.now()}@example.com`;
    const userResult = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').run(userEmail, 'hash', 'Test User');
    const userId = userResult.lastInsertRowid;
    console.log(`Created Test User: ID ${userId}`);

    // 2. Create a Test Product with Stock 10
    const initialStock = 10;
    const productName = `Test Product ${Date.now()}`;
    const productResult = db.prepare('INSERT INTO products (name, price, stock, is_active) VALUES (?, ?, ?, 1)').run(productName, 100, initialStock);
    const productId = productResult.lastInsertRowid;
    console.log(`Created Test Product: ID ${productId}, Stock: ${initialStock}`);

    // 3. Simulate Order Creation Logic (copied from orders.js)
    try {
        const items = [{ productId: productId, quantity: 2 }];
        const total = 200;

        // Transaction start (implicit in better-sqlite3 for single statements, but let's emulate the flow)

        // Create order
        const orderResult = db.prepare(`
            INSERT INTO orders (user_id, total, status, payment_status)
            VALUES (?, ?, 'pending', 'pending')
        `).run(userId, total);
        const orderId = orderResult.lastInsertRowid;
        console.log(`Created Order: ID ${orderId}`);

        // Insert items and update stock
        const insertItem = db.prepare(`
            INSERT INTO order_items (order_id, product_id, quantity, price, product_name)
            VALUES (?, ?, ?, ?, ?)
        `);

        // The exact logic from orders.js
        for (const item of items) {
            const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
            insertItem.run(orderId, item.productId, item.quantity, product.price, product.name);

            // Update stock
            console.log(`Attempting to deduct ${item.quantity} from stock for product ${item.productId}`);
            const updateResult = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.productId);
            console.log('Update Result:', updateResult);
        }

        // 4. Verify Stock
        const updatedProduct = db.prepare('SELECT stock FROM products WHERE id = ?').get(productId);
        console.log(`Updated Stock: ${updatedProduct.stock}`);

        if (updatedProduct.stock === initialStock - 2) {
            console.log('SUCCESS: Stock deducted correctly.');
        } else {
            console.error('FAILURE: Stock expected to be 8, but is ' + updatedProduct.stock);
        }

    } catch (err) {
        console.error('Test Failed with Error:', err);
    } finally {
        // Cleanup
        db.prepare('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)').run(userId);
        db.prepare('DELETE FROM orders WHERE user_id = ?').run(userId);
        db.prepare('DELETE FROM products WHERE id = ?').run(productId);
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        console.log('Cleanup complete.');
    }
}

runTest();
