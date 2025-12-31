import { WhatsAppMessage } from '@/types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateGST = (amount: number, gstRate: number = 18): number => {
  return (amount * gstRate) / 100;
};

export const generateOrderId = (): string => {
  const prefix = 'LIP';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export const generateWhatsAppLink = (message: WhatsAppMessage): string => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  
  let text = `Hi LIP Team,\n\n`;
  
  if (message.productName) {
    text += `I'm interested in: ${message.productName}\n`;
  }
  
  if (message.packSize) {
    text += `Pack Size: ${message.packSize}\n`;
  }
  
  if (message.quantity) {
    text += `Quantity: ${message.quantity}\n`;
  }
  
  if (message.customOptions) {
    text += `\nCustom Requirements:\n`;
    Object.entries(message.customOptions).forEach(([key, value]) => {
      text += `${key}: ${value}\n`;
    });
  }
  
  if (message.message) {
    text += `\n${message.message}`;
  }
  
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${phoneNumber}?text=${encodedText}`;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\D/g, ''));
};

export const validatePincode = (pincode: string): boolean => {
  const re = /^\d{6}$/;
  return re.test(pincode);
};

