const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateToken, (req, res) => {
    try {
        const wishlistItems = db.prepare(`
      SELECT w.id, w.created_at, p.id as product_id, p.name, p.price, p.image_url, p.stock, p.category
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id);

        res.json({ items: wishlistItems });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Failed to get wishlist' });
    }
});

// Add item to wishlist
router.post('/add', authenticateToken, (req, res) => {
    try {
        const { productId } = req.body;

        // Check if product exists
        const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if already in wishlist
        const existingItem = db.prepare('SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);

        if (existingItem) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        // Add new item
        db.prepare('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId);

        res.json({ message: 'Item added to wishlist' });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// Remove item from wishlist
router.delete('/:productId', authenticateToken, (req, res) => {
    try {
        const { productId } = req.params;

        db.prepare('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);

        res.json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

module.exports = router;
