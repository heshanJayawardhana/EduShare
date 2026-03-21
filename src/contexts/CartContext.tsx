import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  isFree: boolean;
  thumbnail: string;
  module: string;
  faculty: string;
  uploader: string;
  uploaderBadge?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  checkout: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in cart
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + (action.payload.price || 0)
      };

    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.totalItems - 1,
        totalPrice: state.totalPrice - (itemToRemove?.price || 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
        totalPrice: action.payload.reduce((total, item) => total + (item.price || 0), 0)
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('edushare_cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('edushare_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const checkout = async () => {
    try {
      // Get user token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to checkout');
        return;
      }

      // Process checkout
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: state.items,
          totalPrice: state.totalPrice
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Order placed successfully! Resources added to your library.');
        clearCart();
        
        // Redirect to library or order confirmation
        window.location.href = '/my-library';
      } else {
        const error = await response.json();
        alert(error.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      clearCart,
      toggleCart,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
