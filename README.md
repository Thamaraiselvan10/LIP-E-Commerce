# LIP Packaging - E-commerce Website

A modern B2B/B2C packaging e-commerce platform built with Next.js, React, and TypeScript.

## Features

- 🛍️ Product catalog (Boxes, Tapes, Courier Covers)
- 🛒 Shopping cart with pack size options
- 💳 Prepaid payment integration (UPI, Razorpay)
- 📱 WhatsApp integration for custom inquiries
- 📦 Order tracking system
- 👨‍💼 Admin panel for product and order management
- 📄 Legal pages (Privacy, Terms, Shipping, Returns)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Payment**: Razorpay, UPI
- **Notifications**: React Hot Toast

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
```

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and stores
├── types/           # TypeScript types
└── public/          # Static assets
```

