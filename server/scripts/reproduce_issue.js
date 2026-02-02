// using built-in fetch

async function testLogin(email, password, role) {
    console.log(`Testing ${role} login with ${email}...`);
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`SUCCESS: ${role} login successful.`);
            console.log('User data:', data.user);
            console.log('User data:', data.user);

            // Test Protected Route (Cart)
            const token = data.token;
            console.log(`Testing protected route (Cart) for ${role}...`);
            const cartResponse = await fetch('http://localhost:5000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                console.log(`SUCCESS: Cart fetch successful. Items: ${cartData.items?.length}`);
            } else {
                console.log(`FAILED: Cart fetch failed. Status: ${cartResponse.status}`);
            }
        } else {
            console.log(`FAILED: ${role} login failed. Status: ${response.status}`);
            console.log('Error:', data.error);
        }
    } catch (error) {
        console.error(`ERROR: Could not connect to server. Is it running? ${error.message}`);
    }
    console.log('---');
}

async function run() {
    // Admin
    await testLogin('admin@gmail.com', 'admin@123', 'Admin');

    // Customer
    await testLogin('customer@gmail.com', 'admin@123', 'Customer');
}

run();
