import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const res = await api.get('/wishlist');
          setWishlist(res.data);
        } catch (error) {
          console.error('Failed to load wishlist from server', error);
        }
      } else {
        setWishlist([]);
      }
    };
    loadWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      alert('Please log in to add products to your wishlist.');
      return;
    }

    const inList = wishlist.find((item) => item.productId === product.id);

    if (inList) {
      try {
        await api.delete(`/wishlist/${product.id}`);
        setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      } catch (error) {
        console.error('Error removing from wishlist', error);
      }
    } else {
      try {
        const res = await api.post('/wishlist', { productId: product.id });
        setWishlist((prev) => [...prev, res.data]);
      } catch (error) {
        console.error('Error adding to wishlist', error);
      }
    }
  };

  const inWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, inWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
