export interface Product {
  id: string;
  name: string;
  category: 'boxes' | 'tapes' | 'covers';
  subcategory: string;
  images: string[];
  description: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  thickness?: string;
  gsm?: number[];
  packSizes: PackSize[];
  basePrice: number;
  inStock: boolean;
}

export interface PackSize {
  size: number;
  price: number;
  discount?: number;
}

export interface CartItem {
  product: Product;
  packSize: number;
  quantity: number;
  selectedGsm?: number;
  selectedThickness?: string;
  customOptions?: Record<string, any>;
}

export interface Order {
  id: string;
  orderId: string;
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  gst: number;
  finalTotal: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  companyName?: string;
  gstNumber?: string;
}

export type OrderStatus = 'confirmed' | 'in_production' | 'dispatched' | 'delivered';

export interface WhatsAppMessage {
  productName: string;
  packSize?: number;
  quantity?: number;
  customOptions?: Record<string, any>;
  message?: string;
}

