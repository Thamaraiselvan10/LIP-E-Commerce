import { FaTag, FaPercent, FaGift, FaFire } from 'react-icons/fa';
import Link from 'next/link';

export default function OffersPage() {
  const offers = [
    {
      id: 1,
      title: 'Bulk Order Discount',
      description: 'Buy 100+ units and save up to 15%',
      discount: '15% OFF',
      code: 'BULK100',
      validUntil: '2024-12-31',
      icon: <FaTag className="text-4xl" />,
      color: 'from-primary-600 to-purple-700',
    },
    {
      id: 2,
      title: 'Festival Special',
      description: 'Special discount on all boxes and tapes',
      discount: '10% OFF',
      code: 'FESTIVAL2024',
      validUntil: '2024-12-31',
      icon: <FaGift className="text-4xl" />,
      color: 'from-gold-500 to-gold-600',
    },
    {
      id: 3,
      title: 'New Customer Offer',
      description: 'First order discount for new customers',
      discount: '20% OFF',
      code: 'NEWUSER20',
      validUntil: '2024-12-31',
      icon: <FaFire className="text-4xl" />,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 4,
      title: 'Buy 1000+ Save More',
      description: 'Maximum savings on bulk orders',
      discount: '20% OFF',
      code: 'BULK1000',
      validUntil: '2024-12-31',
      icon: <FaPercent className="text-4xl" />,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-800 bg-clip-text text-transparent">
          Special Offers & Discounts
        </h1>
        <p className="text-xl text-gray-600">
          Save more with our exclusive offers and bulk pricing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-gradient-to-br ${offer.color} rounded-2xl shadow-xl p-8 text-white relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                  {offer.icon}
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1">{offer.discount}</div>
                  <div className="text-sm opacity-90">Valid until {offer.validUntil}</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
              <p className="text-white text-opacity-90 mb-4">{offer.description}</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <div className="text-sm mb-1">Use Code:</div>
                <div className="text-2xl font-mono font-bold">{offer.code}</div>
              </div>
              <Link
                href="/products/boxes"
                className="inline-block bg-white text-primary-700 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Bulk Pricing Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { qty: '25-49', discount: '0%', savings: 'Standard Price' },
            { qty: '50-99', discount: '5%', savings: 'Save 5%' },
            { qty: '100-999', discount: '10%', savings: 'Save 10%' },
            { qty: '1000+', discount: '15-20%', savings: 'Maximum Savings' },
          ].map((tier, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl font-bold text-primary-600 mb-2">{tier.qty}</div>
              <div className="text-2xl font-bold text-gold-600 mb-1">{tier.discount}</div>
              <div className="text-sm text-gray-600">{tier.savings}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">How to Use Coupon Codes</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Browse our products and add items to your cart</li>
          <li>Proceed to checkout</li>
          <li>Enter the coupon code in the "Apply Coupon" field</li>
          <li>Click "Apply" to see the discount</li>
          <li>Complete your payment</li>
        </ol>
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Only one coupon can be used per order. Coupons cannot be combined with other offers.
          </p>
        </div>
      </div>
    </div>
  );
}

