export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose">
        <h1 className="text-4xl font-bold mb-8">Returns & Refund Policy</h1>
        
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Return Eligibility</h2>
          <p className="text-gray-700 mb-4">
            Returns are accepted only under the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Product is damaged or defective upon delivery</li>
            <li>Wrong product received</li>
            <li>Product does not match the description</li>
            <li>Return request must be made within 7 days of delivery</li>
            <li>Product must be unused and in original packaging</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Custom orders (unless defective)</li>
            <li>Products used or damaged by the customer</li>
            <li>Products returned after 7 days</li>
            <li>Products without original packaging</li>
            <li>Bulk orders (1000+ units) - subject to special terms</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Return Process</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
            <li>Contact us via WhatsApp or email with your order ID</li>
            <li>Provide photos of the damaged/defective product</li>
            <li>We will review your request and provide return authorization</li>
            <li>Ship the product back to our address (we will provide details)</li>
            <li>Once received and verified, we will process your refund</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Refund Processing</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Refunds will be processed within 7-10 business days after we receive the returned product</li>
            <li>Refund will be issued to the original payment method</li>
            <li>Shipping charges (if any) are non-refundable unless the return is due to our error</li>
            <li>You will receive an email confirmation once the refund is processed</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Replacement Policy</h2>
          <p className="text-gray-700 mb-4">
            For damaged or defective products, we offer:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Free replacement for damaged/defective items</li>
            <li>Replacement will be shipped within 3-5 business days</li>
            <li>You can choose between replacement or refund</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Cancellation Policy</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Orders can be cancelled before production begins</li>
            <li>Cancellation requests must be made within 24 hours of order placement</li>
            <li>Custom orders cannot be cancelled once production starts</li>
            <li>Full refund will be issued for cancelled orders</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Contact for Returns</h2>
          <p className="text-gray-700 mb-4">
            To initiate a return, contact us at:
          </p>
          <p className="text-gray-700 mb-4">
            Email: info@lippackaging.com<br />
            Phone: +91 9876543210<br />
            WhatsApp: For fastest response
          </p>
          <p className="text-gray-700">
            Please include your order ID and reason for return in your message.
          </p>
        </section>
      </div>
    </div>
  );
}

