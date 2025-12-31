export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using the LIP Packaging website, you accept and agree to be bound by these 
            Terms and Conditions. If you do not agree, please do not use our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Products and Pricing</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>All product prices are in Indian Rupees (INR) and are subject to change without notice.</li>
            <li>Prices include applicable taxes but exclude shipping charges (if any).</li>
            <li>Product images are for illustration purposes only. Actual products may vary slightly.</li>
            <li>We reserve the right to limit quantities and refuse orders.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Payment Terms</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><strong>Prepaid Orders Only:</strong> Cash on Delivery (COD) is not available.</li>
            <li>All orders must be paid in full before processing.</li>
            <li>We accept UPI, credit/debit cards, and other online payment methods.</li>
            <li>Payment must be completed within the specified time frame.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Order Processing</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Order confirmation will be sent via email and WhatsApp.</li>
            <li>Production time: 3-5 business days (may vary for custom orders).</li>
            <li>Shipping time: 5-7 business days after dispatch.</li>
            <li>We reserve the right to cancel orders due to unavailability or pricing errors.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Shipping and Delivery</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>We ship to addresses within India only.</li>
            <li>Delivery times are estimates and may vary based on location.</li>
            <li>Risk of loss passes to you upon delivery.</li>
            <li>You are responsible for providing accurate shipping addresses.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Returns and Refunds</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Returns are accepted only for damaged or defective products.</li>
            <li>Returns must be requested within 7 days of delivery.</li>
            <li>Products must be unused and in original packaging.</li>
            <li>Refunds will be processed within 7-10 business days.</li>
            <li>Custom orders are non-refundable unless defective.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Custom Orders</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Custom sizes and branding require approval and may have longer production times.</li>
            <li>Custom orders are non-cancellable once production begins.</li>
            <li>Additional charges may apply for custom specifications.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            LIP Packaging shall not be liable for any indirect, incidental, or consequential damages 
            arising from the use of our products or website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content on this website, including text, images, and logos, is the property of LIP Packaging 
            and is protected by copyright laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For questions about these Terms & Conditions, contact us at:
          </p>
          <p className="text-gray-700">
            Email: info@lippackaging.com<br />
            Phone: +91 9876543210
          </p>
        </section>
      </div>
    </div>
  );
}

