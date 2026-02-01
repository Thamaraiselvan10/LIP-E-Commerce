const db = require('./db');
const bcrypt = require('bcryptjs');

const seedDatabase = () => {
    console.log('Seeding database...');

    // Create default admin user
    const adminPassword = bcrypt.hashSync('admin@123', 10);

    try {
        const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@gmail.com');

        if (!existingAdmin) {
            db.prepare(`
        INSERT INTO users (email, password_hash, name, role)
        VALUES (?, ?, ?, ?)
      `).run('admin@gmail.com', adminPassword, 'Admin', 'admin');
            console.log('Default admin created: admin@gmail.com / admin@123');
        } else {
            console.log('Admin already exists');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }

    // Seed categories
    const categories = [
        'Lip Boxes',
        'Containers',
        'Tubes',
        'Gift Sets',
        'Applicators'
    ];

    const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');

    for (const category of categories) {
        insertCategory.run(category);
    }
    console.log('Sample categories seeded');

    // Seed sample products
    const products = [
        {
            name: 'Premium Lip Packaging Box',
            description: 'High-quality packaging box for lip products. Perfect for lipstick, lip gloss, and lip balm packaging.',
            price: 299.00,
            category: 'Lip Boxes',
            image_url: '/uploads/products/lip-box-1.jpg',
            stock: 100
        },
        {
            name: 'Luxury Lipstick Container',
            description: 'Elegant luxury container for premium lipstick products. Features gold trim and magnetic closure.',
            price: 499.00,
            category: 'Containers',
            image_url: '/uploads/products/container-1.jpg',
            stock: 50
        },
        {
            name: 'Eco-Friendly Lip Balm Tube',
            description: 'Sustainable and biodegradable lip balm tube. Made from recycled materials.',
            price: 149.00,
            category: 'Tubes',
            image_url: '/uploads/products/tube-1.jpg',
            stock: 200
        },
        {
            name: 'Custom Printed Gift Box',
            description: 'Customizable gift box set for lip care products. Includes inner tray and ribbon.',
            price: 799.00,
            category: 'Gift Sets',
            image_url: '/uploads/products/gift-box-1.jpg',
            stock: 30
        },
        {
            name: 'Lip Gloss Wand Applicator',
            description: 'Professional-grade lip gloss applicator wand. Doe foot design for smooth application.',
            price: 49.00,
            category: 'Applicators',
            image_url: '/uploads/products/applicator-1.jpg',
            stock: 500
        },
        {
            name: 'Matte Black Lipstick Tube',
            description: 'Sleek matte black aluminum lipstick tube. Modern minimalist design.',
            price: 199.00,
            category: 'Tubes',
            image_url: '/uploads/products/matte-tube-1.jpg',
            stock: 150
        }
    ];


    const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, description, price, category, image_url, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    for (const product of products) {
        try {
            insertProduct.run(
                product.name,
                product.description,
                product.price,
                product.category,
                product.image_url,
                product.stock
            );
        } catch (error) {
            // Product might already exist
        }
    }
    console.log('Sample products seeded');

    // Seed sample announcement
    try {
        const existingAnnouncement = db.prepare('SELECT id FROM announcements LIMIT 1').get();

        if (!existingAnnouncement) {
            db.prepare(`
        INSERT INTO announcements (title, message, type, is_active, created_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(
                'Welcome to LIP Packaging!',
                '🎉 Get 20% off on your first order! Use code WELCOME20 at checkout.',
                'both',
                1,
                1
            );
            console.log('Sample announcement created');
        }
    } catch (error) {
        console.error('Error creating announcement:', error);
    }

    console.log('Database seeding completed!');

    // Seed sample customer
    let userId;
    try {
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('customer@gmail.com');
        if (!existingUser) {
            const result = db.prepare(`
                INSERT INTO users (email, password_hash, name, role)
                VALUES (?, ?, ?, ?)
            `).run('customer@gmail.com', adminPassword, 'John Customer', 'user'); // Using same password for demo
            userId = result.lastInsertRowid;
            console.log('Sample customer created: customer@gmail.com');
        } else {
            userId = existingUser.id;
        }
    } catch (error) {
        console.error('Error creating customer:', error);
    }

    // Seed sample orders
    if (userId) {
        // Fetch product IDs dynamically
        const getProductId = (name) => {
            const product = db.prepare('SELECT id, price FROM products WHERE name = ?').get(name);
            return product ? product : null;
        };

        const orders = [
            {
                status: 'pending',
                total: 598.00,
                shipping_name: 'John Customer',
                shipping_address: '123 Main St',
                shipping_city: 'Mumbai',
                shipping_state: 'Maharashtra',
                shipping_pincode: '400001',
                payment_status: 'pending',
                items: [
                    { productName: 'Premium Lip Packaging Box', quantity: 2 }
                ]
            },
            {
                status: 'processing',
                total: 499.00,
                shipping_name: 'John Customer',
                shipping_address: '123 Main St',
                shipping_city: 'Mumbai',
                shipping_state: 'Maharashtra',
                shipping_pincode: '400001',
                payment_status: 'completed',
                items: [
                    { productName: 'Luxury Lipstick Container', quantity: 1 }
                ]
            },
            {
                status: 'shipped',
                total: 647.00,
                shipping_name: 'John Customer',
                shipping_address: '123 Main St',
                shipping_city: 'Mumbai',
                shipping_state: 'Maharashtra',
                shipping_pincode: '400001',
                payment_status: 'completed',
                items: [
                    { productName: 'Eco-Friendly Lip Balm Tube', quantity: 3 },
                    { productName: 'Matte Black Lipstick Tube', quantity: 1 }
                ]
            },
            {
                status: 'delivered',
                total: 799.00,
                shipping_name: 'John Customer',
                shipping_address: '123 Main St',
                shipping_city: 'Mumbai',
                shipping_state: 'Maharashtra',
                shipping_pincode: '400001',
                payment_status: 'completed',
                items: [
                    { productName: 'Custom Printed Gift Box', quantity: 1 }
                ]
            },
            {
                status: 'cancelled',
                total: 199.00,
                shipping_name: 'John Customer',
                shipping_address: '123 Main St',
                shipping_city: 'Mumbai',
                shipping_state: 'Maharashtra',
                shipping_pincode: '400001',
                payment_status: 'failed',
                items: [
                    { productName: 'Matte Black Lipstick Tube', quantity: 1 }
                ]
            }
        ];

        const insertOrder = db.prepare(`
            INSERT INTO orders (user_id, status, total, shipping_name, shipping_address, shipping_city, shipping_state, shipping_pincode, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const insertOrderItem = db.prepare(`
            INSERT INTO order_items (order_id, product_id, quantity, price, product_name)
            VALUES (?, ?, ?, ?, ?)
        `);

        // Check if orders exist to avoid duplicates (simple check)
        const orderCount = db.prepare('SELECT count(*) as count FROM orders').get().count;

        if (orderCount === 0) {
            for (const order of orders) {
                try {
                    let orderTotal = 0;
                    const orderItems = [];

                    // Prepare items and calculate total (optional, but ensures data consistency)
                    for (const item of order.items) {
                        const product = getProductId(item.productName);
                        if (product) {
                            orderItems.push({
                                product_id: product.id,
                                quantity: item.quantity,
                                price: product.price,
                                name: item.productName
                            });
                            orderTotal += product.price * item.quantity;
                        }
                    }

                    if (orderItems.length > 0) {
                        const result = insertOrder.run(
                            userId,
                            order.status,
                            order.total, // Using hardcoded total to match example, or could use calculated orderTotal
                            order.shipping_name,
                            order.shipping_address,
                            order.shipping_city,
                            order.shipping_state,
                            order.shipping_pincode,
                            order.payment_status
                        );

                        const orderId = result.lastInsertRowid;

                        for (const item of orderItems) {
                            insertOrderItem.run(
                                orderId,
                                item.product_id,
                                item.quantity,
                                item.price,
                                item.name
                            );
                        }
                    }
                } catch (error) {
                    console.error('Error inserting sample order:', error);
                }
            }
            console.log('Sample orders seeded');
        } else {
            console.log('Orders already exist, skipping seed');
        }
    }
};

// Run seeding
seedDatabase();
