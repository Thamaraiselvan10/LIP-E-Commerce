# LIP Packaging - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key_here
   RAZORPAY_SECRET=your_razorpay_secret_here
   NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── payment/           # Payment page
│   ├── products/          # Product pages
│   ├── track-order/       # Order tracking
│   ├── admin/             # Admin panel
│   └── [legal-pages]/     # About, Contact, Privacy, etc.
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── lib/                   # Utilities and stores
│   ├── store.ts           # Zustand cart store
│   ├── products.ts        # Product data
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript types
    └── index.ts
```

## Features Implemented

### ✅ Core Features
- [x] Home page with hero, categories, and testimonials
- [x] Product catalog (Boxes, Tapes, Courier Covers)
- [x] Product detail pages with pack size selection
- [x] Shopping cart with quantity management
- [x] Checkout with customer details form
- [x] Payment page (UPI & Razorpay ready)
- [x] Order confirmation page
- [x] Order tracking system
- [x] WhatsApp integration for custom inquiries
- [x] Admin panel for order management

### ✅ Legal Pages
- [x] About Us
- [x] Contact Us
- [x] Privacy Policy
- [x] Terms & Conditions
- [x] Shipping Policy
- [x] Returns & Refund Policy

### ✅ Key Features
- Prepaid-only policy (no COD)
- GST calculation and support
- Bulk pricing options
- Custom branding via WhatsApp
- Responsive design
- Order status tracking

## Payment Integration

### Razorpay Setup
1. Sign up at [Razorpay](https://razorpay.com)
2. Get your API keys from the dashboard
3. Add keys to `.env.local`
4. Update payment handler in `app/payment/page.tsx`

### UPI Setup
- Currently uses demo UPI ID
- Replace with your actual UPI ID in payment page
- QR code generation can be added for production

## WhatsApp Integration

1. Update `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`
2. Format: Country code + number (e.g., 919876543210)
3. WhatsApp links are auto-generated throughout the site

## Admin Panel

Access at `/admin` to:
- View all orders
- Update order status
- View order details
- Track revenue and statistics

**Note:** In production, add authentication to protect the admin panel.

## Database Integration

Currently, orders are stored in `localStorage` for demo purposes. For production:

1. Set up a database (PostgreSQL/MySQL)
2. Create API routes in `app/api/`
3. Replace localStorage calls with API calls
4. Implement proper authentication

## Customization

### Products
- Edit `lib/products.ts` to add/modify products
- Update pack sizes and pricing
- Add product images to `public/images/`

### Styling
- Tailwind CSS is configured in `tailwind.config.js`
- Customize colors in the config file
- Update `app/globals.css` for global styles

## Production Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Or deploy to other platforms:**
   - AWS, DigitalOcean, etc.
   - Follow Next.js deployment guides

## Important Notes

- ⚠️ **Payment Gateway:** Currently uses demo payment flow. Integrate real payment gateway for production.
- ⚠️ **Database:** Replace localStorage with a real database for production.
- ⚠️ **Authentication:** Add authentication for admin panel.
- ⚠️ **Images:** Add actual product images to `public/images/` directory.
- ⚠️ **Email:** Set up email service for order confirmations.

## Support

For questions or issues, contact:
- Email: info@lippackaging.com
- WhatsApp: Available on the website

