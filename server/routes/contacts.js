const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

// Create contact table if not exists
db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT CHECK(status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Submit contact form (public)
router.post('/', (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const result = db.prepare(`
            INSERT INTO contacts (first_name, last_name, email, message)
            VALUES (?, ?, ?, ?)
        `).run(firstName, lastName, email, message);

        res.status(201).json({
            message: 'Thank you for contacting us! We will get back to you soon.',
            id: result.lastInsertRowid
        });
    } catch (error) {
        console.error('Submit contact error:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

// Get all contacts (admin only)
router.get('/', authenticateToken, isAdmin, (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM contacts';
        const params = [];

        if (status && status !== 'all') {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const contacts = db.prepare(query).all(...params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM contacts';
        if (status && status !== 'all') {
            countQuery += ' WHERE status = ?';
        }
        const { total } = status && status !== 'all'
            ? db.prepare(countQuery).get(status)
            : db.prepare(countQuery).get();

        // Get status counts for filter badges
        const statusCounts = db.prepare(`
            SELECT status, COUNT(*) as count FROM contacts GROUP BY status
        `).all();

        res.json({
            contacts,
            total,
            statusCounts: statusCounts.reduce((acc, curr) => {
                acc[curr.status] = curr.count;
                return acc;
            }, {})
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Failed to get contacts' });
    }
});

// Get single contact (admin only)
router.get('/:id', authenticateToken, isAdmin, (req, res) => {
    try {
        const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Mark as read if it's new
        if (contact.status === 'new') {
            db.prepare('UPDATE contacts SET status = ?, updated_at = ? WHERE id = ?')
                .run('read', new Date().toISOString(), req.params.id);
            contact.status = 'read';
        }

        res.json({ contact });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Failed to get contact' });
    }
});

// Update contact status (admin only)
router.patch('/:id/status', authenticateToken, isAdmin, (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['new', 'read', 'replied', 'archived'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        db.prepare('UPDATE contacts SET status = ?, updated_at = ? WHERE id = ?')
            .run(status, new Date().toISOString(), req.params.id);

        res.json({ message: 'Status updated', status });
    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Delete contact (admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
    try {
        const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Get new contacts count (for admin dashboard/badge)
router.get('/stats/new-count', authenticateToken, isAdmin, (req, res) => {
    try {
        const { count } = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE status = ?').get('new');
        res.json({ count });
    } catch (error) {
        console.error('Get new contacts count error:', error);
        res.status(500).json({ error: 'Failed to get count' });
    }
});

module.exports = router;
