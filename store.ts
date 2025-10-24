import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './sanity.types';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStatue?: string;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product, selectedColor?: string, selectedStatue?: string) => void;
  removeItem: (productId: string, selectedColor?: string, selectedStatue?: string) => void;
  deleteCartProduct: (productId: string, selectedColor?: string, selectedStatue?: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string, selectedColor?: string, selectedStatue?: string) => number;
  getGroupedItems: () => CartItem[];
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],

      addItem: (product, selectedColor, selectedStatue) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product._id === product._id &&
              item.selectedColor === selectedColor &&
              item.selectedStatue === selectedStatue
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item === existingItem
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { product, quantity: 1, selectedColor, selectedStatue }],
            };
          }
        }),

      removeItem: (productId, selectedColor, selectedStatue) =>
        set((state) => ({
          items: state.items.reduce<CartItem[]>((acc, item) => {
            if (
              item.product._id === productId &&
              item.selectedColor === selectedColor &&
              item.selectedStatue === selectedStatue
            ) {
              if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 });
            } else {
              acc.push(item);
            }
            return acc;
          }, []),
        })),

      deleteCartProduct: (productId, selectedColor, selectedStatue) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product._id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedStatue === selectedStatue)
          ),
        })),

      resetCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product?.price ?? 0) * item.quantity,
          0
        ),

      getSubTotalPrice: () =>
        get().items.reduce((total, item) => {
          const price = item.product?.price ?? 0;
          const discount = ((item.product?.discount ?? 0) * price) / 100;
          return total + (price - discount) * item.quantity;
        }, 0),

      getItemCount: (productId, selectedColor, selectedStatue) => {
        const item = get().items.find(
          (i) =>
            i.product?._id === productId &&
            i.selectedColor === selectedColor &&
            i.selectedStatue === selectedStatue
        );
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      addToFavorite: async (product) => {
        return new Promise<void>((resolve) => {
          set((state) => {
            const isFavorite = state.favoriteProduct.some((item) => item._id === product._id);
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter((item) => item._id !== product._id)
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },

      removeFromFavorite: (productId) =>
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter((item) => item._id !== productId),
        })),

      resetFavorite: () => set({ favoriteProduct: [] }),
    }),
    {
      name: 'cart-store',
    }
  )
);

export default useStore;
