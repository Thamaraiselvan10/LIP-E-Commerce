export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose">
        <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
        
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Shipping Areas</h2>
          <p className="text-gray-700 mb-4">
            We currently ship to all locations within India. International shipping is not available at this time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Processing Time</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><strong>Standard Products:</strong> 3-5 business days for production</li>
            <li><strong>Custom Orders:</strong> 7-10 business days (may vary based on specifications)</li>
            <li>Orders are processed Monday through Saturday (excluding holidays)</li>
            <li>You will receive an email notification when your order is dispatched</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Shipping Methods</h2>
          <p className="text-gray-700 mb-4">
            We use reliable courier partners to ensure safe and timely delivery:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Standard Shipping: 5-7 business days</li>
            <li>Express Shipping: 2-3 business days (available for select locations)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Shipping Charges</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Shipping charges (if applicable) are calculated at checkout</li>
            <li>Free shipping may be available for orders above a certain value</li>
            <li>Custom shipping arrangements available for bulk orders</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Order Tracking</h2>
          <p className="text-gray-700 mb-4">
            Once your order is dispatched, you will receive:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Tracking number via email and WhatsApp</li>
            <li>Real-time tracking updates</li>
            <li>Estimated delivery date</li>
          </ul>
          <p className="text-gray-700 mb-4">
            You can track your order using the "Track Order" page on our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Delivery Address</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Please ensure your shipping address is complete and accurate</li>
            <li>We are not responsible for delays due to incorrect addresses</li>
            <li>Address changes must be requested before order dispatch</li>
            <li>Additional charges may apply for address corrections</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Delivery Issues</h2>
          <p className="text-gray-700 mb-4">
            If you experience any delivery issues:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Contact us immediately via WhatsApp or email</li>
            <li>Provide your order ID and tracking number</li>
            <li>We will investigate and resolve the issue promptly</li>
            <li>Refunds or replacements will be processed as per our Returns Policy</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            For shipping-related inquiries, contact us at:
          </p>
          <p className="text-gray-700">
            Email: info@lippackaging.com<br />
            Phone: +91 9876543210<br />
            WhatsApp: Available 24/7
          </p>
        </section>
      </div>
    </div>
  );
}

