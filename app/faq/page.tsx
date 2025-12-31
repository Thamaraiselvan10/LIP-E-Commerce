import { FaQuestionCircle, FaBox, FaTape, FaEnvelope, FaTruck, FaCreditCard } from 'react-icons/fa';

export default function FAQPage() {
  const faqs = [
    {
      category: 'Products',
      icon: <FaBox />,
      questions: [
        {
          q: 'What is GSM in boxes?',
          a: 'GSM (Grams per Square Meter) indicates the thickness and strength of the cardboard. Higher GSM means thicker and stronger boxes. We offer 200, 250, 300, and 350 GSM options.',
        },
        {
          q: 'What is the difference between Self-Lock and Corrugated boxes?',
          a: 'Self-Lock boxes have an integrated locking mechanism and don\'t require tape. Corrugated boxes are standard shipping boxes that need tape to seal. Both are durable and suitable for shipping.',
        },
        {
          q: 'What is POD in courier covers?',
          a: 'POD stands for "Proof of Delivery". POD covers have a detachable section for delivery confirmation. Non-POD covers are standard envelopes without this feature.',
        },
        {
          q: 'What sizes are available?',
          a: 'We offer various standard sizes. For custom sizes, please contact us via WhatsApp or use our bulk order form.',
        },
      ],
    },
    {
      category: 'Orders & Shipping',
      icon: <FaTruck />,
      questions: [
        {
          q: 'What is the minimum order quantity?',
          a: 'Standard orders start from pack of 25. For bulk orders (100+ units), we offer special pricing. Contact us for custom requirements.',
        },
        {
          q: 'How long does shipping take?',
          a: 'Standard products take 3-5 days for production and 5-7 days for shipping. Custom orders may take 7-10 days. Express shipping is available for select locations.',
        },
        {
          q: 'Do you ship pan-India?',
          a: 'Yes, we ship to all locations within India. International shipping is not available at this time.',
        },
        {
          q: 'Can I track my order?',
          a: 'Yes! Once your order is dispatched, you\'ll receive a tracking number via email and WhatsApp. You can also track it on our "Track Order" page.',
        },
      ],
    },
    {
      category: 'Payment',
      icon: <FaCreditCard />,
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept UPI, credit/debit cards, and other online payment methods. Cash on Delivery (COD) is not available.',
        },
        {
          q: 'Why is COD not available?',
          a: 'We operate on a prepaid model to ensure faster processing and better pricing. This allows us to offer competitive rates and maintain quality standards.',
        },
        {
          q: 'Is GST included in the price?',
          a: 'GST (18%) is calculated separately and shown at checkout. We provide GST invoices for all orders.',
        },
        {
          q: 'Can I get a GST invoice?',
          a: 'Yes, GST invoices are provided for all orders. Please provide your GST number during checkout if you have one.',
        },
      ],
    },
    {
      category: 'Customization',
      icon: <FaTape />,
      questions: [
        {
          q: 'Can I get custom sizes?',
          a: 'Yes! We offer custom sizing for bulk orders (100+ units). Contact us via WhatsApp or use our bulk order form for quotes.',
        },
        {
          q: 'Do you offer custom printing/branding?',
          a: 'Yes, we offer custom printing and branding services. This includes logos, text, and designs on boxes and tapes. Minimum order quantities apply.',
        },
        {
          q: 'What is the minimum quantity for custom printing?',
          a: 'Custom printing typically requires a minimum order of 500 units. Contact us for specific requirements and pricing.',
        },
        {
          q: 'How long does custom printing take?',
          a: 'Custom printing orders take 7-10 business days for production, plus shipping time. Rush orders may be available at additional cost.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      icon: <FaEnvelope />,
      questions: [
        {
          q: 'Can I return products?',
          a: 'Returns are accepted for damaged or defective products within 7 days of delivery. Products must be unused and in original packaging.',
        },
        {
          q: 'Are custom orders refundable?',
          a: 'Custom orders (including custom sizes and printing) are non-refundable unless defective, as they are made specifically for you.',
        },
        {
          q: 'How long do refunds take?',
          a: 'Refunds are processed within 7-10 business days after we receive and verify the returned product.',
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FaQuestionCircle className="text-6xl text-primary-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-800 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our products, orders, and services
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold">{category.category}</h2>
              </div>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Contact us and we'll be happy to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

