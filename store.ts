import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './sanity.types';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product, selectedColor?: string) => void;
  removeItem: (productId: string, selectedColor?: string) => void;
  deleteCartProduct: (productId: string, selectedColor?: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string, selectedColor?: string) => number;
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

      addItem: (product, selectedColor) =>
        set((state) => {
          if (!product?._id) {
            console.warn("addItem called with invalid product");
            return state;
          }

          // Compute stock for selected color
          const colorStock =
            product.colors?.find(c => c.colorName === selectedColor)?.stock ??
            product.stock ??
            0;

          // Find existing cart item
          const existingItem = state.items.find(
            item =>
              item.product._id === product._id &&
              item.selectedColor === selectedColor
          );

          if (existingItem) {
            if (existingItem.quantity < colorStock) {
              return {
                items: state.items.map(item =>
                  item === existingItem
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            } else {
              console.warn("Cannot add more items, stock limit reached.");
              return state;
            }
          } else {
            if (colorStock > 0) {
              return {
                items: [...state.items, { product, quantity: 1, selectedColor }],
              };
            } else {
              console.warn("Cannot add item, out of stock.");
              return state;
            }
          }
        }),

      removeItem: (productId, selectedColor) =>
        set(state => ({
          items: state.items.reduce<CartItem[]>((acc, item) => {
            if (
              item.product._id === productId &&
              item.selectedColor === selectedColor
            ) {
              if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 });
            } else {
              acc.push(item);
            }
            return acc;
          }, []),
        })),

      deleteCartProduct: (productId, selectedColor) =>
        set(state => ({
          items: state.items.filter(
            item =>
              !(item.product._id === productId && item.selectedColor === selectedColor)
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

      getItemCount: (productId, selectedColor) => {
        const item = get().items.find(
          i =>
            i.product?._id === productId &&
            i.selectedColor === selectedColor
        );
        return item?.quantity ?? 0;
      },

      getGroupedItems: () => get().items,

      addToFavorite: async product => {
        return new Promise<void>((resolve) => {
          set(state => {
            const isFavorite = state.favoriteProduct.some(item => item._id === product._id);
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(item => item._id !== product._id)
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },

      removeFromFavorite: productId =>
        set(state => ({
          favoriteProduct: state.favoriteProduct.filter(item => item._id !== productId),
        })),

      resetFavorite: () => set({ favoriteProduct: [] }),
    }),
    {
      name: 'cart-store',
    }
  )
);

export default useStore;
