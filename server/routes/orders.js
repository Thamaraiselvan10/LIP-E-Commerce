const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

// Create order (authenticated users)
router.post('/', authenticateToken, (req, res) => {
    try {
        const { items, shippingDetails, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must have at least one item' });
        }

        // Check for duplicate order in the last 2 minutes
        const recentOrder = db.prepare(`
            SELECT id FROM orders 
            WHERE user_id = ? AND total > 0 
            AND created_at > datetime('now', '-2 minutes')
            ORDER BY created_at DESC LIMIT 1
        `).get(req.user.id);

        if (recentOrder) {
            // Further verify if items are identical (simplified check)
            const recentItems = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(recentOrder.id);
            const isDuplicate = items.length === recentItems.length && items.every(item =>
                recentItems.find(ri => ri.product_id === item.productId && ri.quantity === item.quantity)
            );

            if (isDuplicate) {
                return res.status(409).json({ error: 'Duplicate order detected. Please wait a moment.' });
            }
        }

        // Calculate total
        let total = 0;
        for (const item of items) {
            const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
            if (!product) {
                return res.status(400).json({ error: `Product ${item.productId} not found` });
            }
            total += product.price * item.quantity;
        }

        // Create order
        const orderResult = db.prepare(`
      INSERT INTO orders (user_id, total, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, payment_method, status, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `).run(
            req.user.id,
            total,
            shippingDetails?.name || '',
            shippingDetails?.phone || '',
            shippingDetails?.address || '',
            shippingDetails?.city || '',
            shippingDetails?.state || '',
            shippingDetails?.pincode || '',
            paymentMethod || 'cod'
        );

        const orderId = orderResult.lastInsertRowid;

        // Insert order items
        const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, price, product_name)
      VALUES (?, ?, ?, ?, ?)
    `);

        const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

        for (const item of items) {
            console.log(`Processing item: ProductID=${item.productId}, Qty=${item.quantity}`);

            const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
            insertItem.run(orderId, item.productId, item.quantity, product.price, product.name);

            // Update stock
            console.log(`Updating stock for Product ${item.productId}: Deducting ${item.quantity}`);
            const result = updateStock.run(item.quantity, item.productId);
            console.log('Stock update result:', result);
        }

        // Clear user's cart
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

        res.status(201).json({
            message: 'Order created successfully',
            orderId,
            total
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get user's orders
router.get('/my-orders', authenticateToken, (req, res) => {
    try {
        const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.id);

        // Get items for each order
        const ordersWithItems = orders.map(order => {
            const items = db.prepare(`
        SELECT oi.*, p.image_url FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(order.id);
            return { ...order, items };
        });

        res.json({ orders: ordersWithItems });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to get orders' });
    }
});

// Get single order
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check ownership (unless admin)
        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const items = db.prepare(`
      SELECT oi.*, p.image_url FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);

        const user = db.prepare('SELECT name, email, phone FROM users WHERE id = ?').get(order.user_id);

        res.json({ order: { ...order, items, user } });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to get order' });
    }
});

// Get all orders (admin only)
router.get('/', authenticateToken, isAdmin, (req, res) => {
    try {
        const { status, limit = 50 } = req.query;

        let query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
        const params = [];

        if (status) {
            query += ' WHERE o.status = ?';
            params.push(status);
        }

        query += ' ORDER BY o.created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const orders = db.prepare(query).all(...params);

        // Get items for each order
        const ordersWithItems = orders.map(order => {
            const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
            return { ...order, items };
        });

        res.json({ orders: ordersWithItems });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Failed to get orders' });
    }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, isAdmin, (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (status) {
            db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);
        }

        if (paymentStatus) {
            db.prepare('UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(paymentStatus, req.params.id);
        }

        const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
        res.json({ message: 'Order updated', order: updatedOrder });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Get order stats (admin only)
router.get('/admin/stats', authenticateToken, isAdmin, (req, res) => {
    try {
        const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
        const totalRevenue = db.prepare('SELECT SUM(total) as sum FROM orders WHERE payment_status = ?').get('completed').sum || 0;
        const pendingOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('pending').count;
        const completedOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('delivered').count;
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('user').count;
        const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count;

        res.json({
            stats: {
                totalOrders,
                totalRevenue,
                pendingOrders,
                completedOrders,
                totalUsers,
                totalProducts
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

module.exports = router;
