import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Load cart on mount or when user login status changes
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const res = await api.get('/cart');
          setCart(res.data);
        } catch (error) {
          console.error('Failed to load cart from server', error);
        }
      } else {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCart(JSON.parse(localCart));
        } else {
          setCart([]);
        }
      }
    };
    loadCart();
  }, [user]);

  // Sync guest cart to localstorage whenever it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await api.post('/cart', { productId: product.id, quantity });
        const resCart = await api.get('/cart');
        setCart(resCart.data);
      } catch (error) {
        console.error('Error adding to cart on server', error);
      }
    } else {
      setCart((prevCart) => {
        const existingIdx = prevCart.findIndex((item) => item.productId === product.id);
        if (existingIdx > -1) {
          const newCart = [...prevCart];
          newCart[existingIdx].quantity += quantity;
          return newCart;
        } else {
          return [
            ...prevCart,
            {
              id: Date.now(), // client side ID
              productId: product.id,
              quantity,
              product,
            },
          ];
        }
      });
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) return;
    if (user) {
      try {
        await api.put(`/cart/${id}`, { quantity });
        const resCart = await api.get('/cart');
        setCart(resCart.data);
      } catch (error) {
        console.error('Error updating cart item on server', error);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (id, productId) => {
    if (user) {
      try {
        await api.delete(`/cart/${id}`);
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting cart item on server', error);
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart/clear');
        setCart([]);
      } catch (error) {
        console.error('Error clearing cart on server', error);
      }
    } else {
      setCart([]);
    }
  };

  // Derive cart counts and prices
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = item.product.price;
    const discount = item.product.discount || 0;
    const finalPrice = price - price * (discount / 100);
    return sum + finalPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
