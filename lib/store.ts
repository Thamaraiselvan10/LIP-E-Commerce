import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, packSize: number) => void;
  updateQuantity: (productId: string, packSize: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    const existingItem = get().items.find(
      (i) => i.product.id === item.product.id && i.packSize === item.packSize
    );
    
    if (existingItem) {
      set({
        items: get().items.map((i) =>
          i.product.id === item.product.id && i.packSize === item.packSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },
  
  removeItem: (productId, packSize) => {
    set({
      items: get().items.filter(
        (i) => !(i.product.id === productId && i.packSize === packSize)
      ),
    });
  },
  
  updateQuantity: (productId, packSize, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, packSize);
      return;
    }
    
    set({
      items: get().items.map((i) =>
        i.product.id === productId && i.packSize === packSize
          ? { ...i, quantity }
          : i
      ),
    });
  },
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    return get().items.reduce((total, item) => {
      const packPrice = item.product.packSizes.find(
        (p) => p.size === item.packSize
      )?.price || 0;
      return total + packPrice * item.quantity;
    }, 0);
  },
  
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));

