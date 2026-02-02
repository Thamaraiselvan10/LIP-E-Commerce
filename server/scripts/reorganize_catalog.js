const db = require('../database/db');

const reorganizeCatalog = () => {
    console.log('Starting catalog reorganization...');

    // 1. Update Schema if needed (already updated in schema.sql, but for existing DB we need to add columns)
    try {
        db.exec("ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES categories(id)");
        console.log('Added category_id to products table');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('category_id already exists in products table');
        } else {
            console.error('Error adding category_id:', e.message);
        }
    }

    try {
        db.exec("ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id)");
        console.log('Added parent_id to categories table');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('parent_id already exists in categories table');
        } else {
            console.error('Error adding parent_id:', e.message);
        }
    }

    // Update UNIQUE constraint on categories is hard with ALTER TABLE in SQLite.
    // We'll handle it during insertion.

    // 2. Clear all data to start fresh (in correct order for FK constraints)
    db.prepare('DELETE FROM cart_items').run();
    db.prepare('DELETE FROM wishlist_items').run();
    db.prepare('DELETE FROM order_items').run();
    db.prepare('DELETE FROM orders').run();
    db.prepare('DELETE FROM products').run();
    db.prepare('DELETE FROM categories').run();
    console.log('Cleared all existing catalog data, orders, cart, and wishlist');

    // 3. Define the precise hierarchy requested
    const hierarchy = [
        { name: 'CARDBOARD BOX' },
        { name: 'TAPES' },
        { name: 'COURIER COVER' },
        { name: 'STICKERS' },
        { name: 'THANK YOU CARDS' }
    ];

    const insertCategory = db.prepare('INSERT INTO categories (name, parent_id) VALUES (?, ?)');

    const seedHierarchy = (items, parentId = null) => {
        for (const item of items) {
            const result = insertCategory.run(item.name, parentId);
            const itemId = result.lastInsertRowid;
            if (item.children) {
                seedHierarchy(item.children, itemId);
            }
        }
    };

    seedHierarchy(hierarchy);
    console.log('Hierarchy seeded successfully');

    // 4. Products were cleared in step 2.

    // 5. Define products to create with specific category mapping
    const productsToCreate = [
        // CARDBOARD BOX
        { name: 'Self-Lock Box', category: 'CARDBOARD BOX', price: 29.00, stock: 1000 },
        { name: 'Corrugated Box', category: 'CARDBOARD BOX', price: 45.00, stock: 1000 },
        { name: 'Customized Logo Box', category: 'CARDBOARD BOX', price: 75.00, stock: 500 },

        // TAPES
        { name: 'Amazon Tape', category: 'TAPES', price: 120.00, stock: 200 },
        { name: 'Flipkart Tape', category: 'TAPES', price: 120.00, stock: 200 },
        { name: 'Amazon Prime Tape', category: 'TAPES', price: 150.00, stock: 150 },
        { name: 'Parcel Tape', category: 'TAPES', price: 90.00, stock: 300 },
        { name: 'White Tape', category: 'TAPES', price: 80.00, stock: 300 },

        // COURIER COVER
        { name: 'Amazon MNF Cover', category: 'COURIER COVER', price: 5.50, stock: 5000 },
        { name: 'Flipkart Cover', category: 'COURIER COVER', price: 5.50, stock: 5000 },
        { name: 'Amazon Cover', category: 'COURIER COVER', price: 5.00, stock: 5000 },
        { name: 'Plain Tamper Proof Cover (POD)', category: 'COURIER COVER', price: 6.50, stock: 2500 },
        { name: 'Plain Tamper Proof Cover (Non-POD)', category: 'COURIER COVER', price: 4.50, stock: 2500 },
        { name: 'Myntra Cover', category: 'COURIER COVER', price: 6.00, stock: 5000 },

        // STICKERS
        { name: 'Customized Stickers', category: 'STICKERS', price: 2.50, stock: 10000 },
        { name: 'Thank You Stickers', category: 'STICKERS', price: 1.50, stock: 10000 },

        // THANK YOU CARDS
        { name: 'Customized Thank You Cards', category: 'THANK YOU CARDS', price: 5.00, stock: 5000 },
        { name: 'Non-Customized Thank You Cards', category: 'THANK YOU CARDS', price: 3.50, stock: 5000 }
    ];

    const allCategories = db.prepare('SELECT * FROM categories').all();
    const insertProduct = db.prepare(`
        INSERT INTO products (name, description, price, category, category_id, stock, image_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    for (const p of productsToCreate) {
        const category = allCategories.find(c => c.name === p.category);
        if (category) {
            insertProduct.run(
                p.name,
                `${p.name} - High quality packaging material.`,
                p.price,
                p.category, // category (text)
                category.id, // category_id (integer)
                p.stock,
                null // image_url
            );
        } else {
            console.warn(`Could not find category: ${p.category} for product: ${p.name}`);
        }
    }

    console.log(`Created ${productsToCreate.length} new products.`);
    console.log('Reorganization completed!');
};

reorganizeCatalog();
process.exit(0);
