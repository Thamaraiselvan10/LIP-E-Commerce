const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/products');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Get all products (public)
router.get('/', optionalAuth, (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sortBy } = req.query;

        let query = 'SELECT * FROM products WHERE is_active = 1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (minPrice) {
            query += ' AND price >= ?';
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            query += ' AND price <= ?';
            params.push(parseFloat(maxPrice));
        }

        // Sorting
        switch (sortBy) {
            case 'price_asc':
                query += ' ORDER BY price ASC';
                break;
            case 'price_desc':
                query += ' ORDER BY price DESC';
                break;
            case 'name_asc':
                query += ' ORDER BY name ASC';
                break;
            case 'newest':
                query += ' ORDER BY created_at DESC';
                break;
            default:
                query += ' ORDER BY id DESC';
        }

        const products = db.prepare(query).all(...params);
        res.json({ products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to get products' });
    }
});

// Get all categories (public)
router.get('/categories', (req, res) => {
    try {
        const categories = db.prepare('SELECT DISTINCT category FROM products WHERE is_active = 1 AND category IS NOT NULL').all();
        res.json({ categories: categories.map(c => c.category) });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to get categories' });
    }
});

// Get single product (public)
router.get('/:id', optionalAuth, (req, res) => {
    try {
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to get product' });
    }
});

// Create product (admin only)
router.post('/', authenticateToken, isAdmin, upload.single('image'), (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

        const result = db.prepare(`
      INSERT INTO products (name, description, price, category, image_url, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, description || '', parseFloat(price), category || null, imageUrl, parseInt(stock) || 0);

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product (admin only)
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), (req, res) => {
    try {
        const { name, description, price, category, stock, is_active } = req.body;
        const productId = req.params.id;

        // Check if product exists
        const existingProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let imageUrl = existingProduct.image_url;
        if (req.file) {
            // Delete old image if exists
            if (existingProduct.image_url) {
                const oldImagePath = path.join(__dirname, '..', existingProduct.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imageUrl = `/uploads/products/${req.file.filename}`;
        }

        db.prepare(`
      UPDATE products SET 
        name = ?, description = ?, price = ?, category = ?, 
        image_url = ?, stock = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
            name || existingProduct.name,
            description ?? existingProduct.description,
            price ? parseFloat(price) : existingProduct.price,
            category ?? existingProduct.category,
            imageUrl,
            stock !== undefined ? parseInt(stock) : existingProduct.stock,
            is_active !== undefined ? (is_active === 'true' || is_active === true ? 1 : 0) : existingProduct.is_active,
            productId
        );

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
        res.json({ message: 'Product updated', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
    try {
        const productId = req.params.id;
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if product is in any orders
        const orderCount = db.prepare('SELECT COUNT(*) as count FROM order_items WHERE product_id = ?').get(productId);

        if (orderCount.count > 0) {
            // Soft delete: Mark as inactive instead of deleting
            db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(productId);
            return res.json({
                message: 'Product archived successfully',
                note: 'Product exists in previous orders, so it was marked as inactive instead of being permanently deleted.'
            });
        }

        // Hard delete: No orders, safe to delete completely

        // Delete image if exists
        if (product.image_url) {
            const imagePath = path.join(__dirname, '..', product.image_url);
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Failed to delete image file:', err);
                // Continue with product deletion even if image delete fails
            }
        }

        db.prepare('DELETE FROM products WHERE id = ?').run(productId);
        res.json({ message: 'Product deleted permanently' });

    } catch (error) {
        console.error('Delete product error:', error);
        // Fallback for any other constraint errors
        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            try {
                db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(req.params.id);
                return res.json({
                    message: 'Product archived',
                    note: 'Constraint violation detected. Product marked as inactive.'
                });
            } catch (softDeleteError) {
                return res.status(500).json({ error: 'Failed to delete or archive product' });
            }
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Get all products for admin (including inactive)
router.get('/admin/all', authenticateToken, isAdmin, (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
        res.json({ products });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ error: 'Failed to get products' });
    }
});

module.exports = router;
