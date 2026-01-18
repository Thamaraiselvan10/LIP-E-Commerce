import { create } from 'zustand';
import { cartAPI } from '../services/api';

const useCartStore = create((set, get) => ({
    items: [],
    total: 0,
    isLoading: false,
    error: null,

    fetchCart: async (silent = false) => {
        if (!silent) set({ isLoading: true });
        try {
            const response = await cartAPI.get();
            set({
                items: response.data.items,
                total: response.data.total,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false, error: error.message });
        }
    },

    addToCart: async (productId, quantity = 1) => {
        try {
            await cartAPI.add(productId, quantity);
            await get().fetchCart(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to add to cart' };
        }
    },

    updateQuantity: async (itemId, quantity) => {
        try {
            await cartAPI.update(itemId, quantity);
            await get().fetchCart(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to update cart' };
        }
    },

    removeItem: async (itemId) => {
        try {
            await cartAPI.remove(itemId);
            await get().fetchCart(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to remove item' };
        }
    },

    clearCart: async () => {
        try {
            await cartAPI.clear();
            set({ items: [], total: 0 });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to clear cart' };
        }
    },

    getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
    },
}));

export default useCartStore;
