import { create } from 'zustand';
import { wishlistAPI } from '../services/api';

const useWishlistStore = create((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchWishlist: async () => {
        set({ isLoading: true });
        try {
            const response = await wishlistAPI.get();
            set({ items: response.data.items, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.message });
        }
    },

    addToWishlist: async (productId) => {
        try {
            await wishlistAPI.add(productId);
            await get().fetchWishlist();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to add to wishlist' };
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            await wishlistAPI.remove(productId);
            await get().fetchWishlist();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to remove from wishlist' };
        }
    },

    isInWishlist: (productId) => {
        return get().items.some(item => item.product_id === productId);
    }
}));

export default useWishlistStore;
