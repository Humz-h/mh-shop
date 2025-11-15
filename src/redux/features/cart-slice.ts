import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

// Helper functions để lưu/load cart từ localStorage theo user
const getCartStorageKey = (): string => {
  if (typeof window === "undefined") return "cart_guest";
  try {
    const customerStr = localStorage.getItem("customer");
    if (customerStr) {
      const customer = JSON.parse(customerStr);
      return `cart_${customer.id || customer.email || 'guest'}`;
    }
  } catch {
    // Ignore errors
  }
  return "cart_guest";
};

const loadCartItemsFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const key = getCartStorageKey();
    const cartStr = localStorage.getItem(key);
    if (cartStr) {
      return JSON.parse(cartStr);
    }
  } catch {
    // Ignore errors
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore errors if localStorage is not available
  }
};

const initialState: InitialState = {
  items: loadCartItemsFromStorage(),
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, imgs } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity,
          discountedPrice,
          imgs,
        });
      }
      // Lưu vào localStorage sau mỗi thay đổi
      saveCartToStorage(state.items);
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      // Lưu vào localStorage sau mỗi thay đổi
      saveCartToStorage(state.items);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
      // Lưu vào localStorage sau mỗi thay đổi
      saveCartToStorage(state.items);
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
      // Lưu vào localStorage sau mỗi thay đổi
      saveCartToStorage(state.items);
    },
    // Action để load cart từ localStorage khi user đăng nhập
    loadCartFromStorage: (state) => {
      state.items = loadCartItemsFromStorage();
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  loadCartFromStorage,
} = cart.actions;
export default cart.reducer;
