import React, { createContext, useState, useContext } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      if (!prevItems.find((item) => item.id === product.id)) {
        alert(`${product.name} added to wishlist!`);
        return [...prevItems, product];
      } else {
        alert(`${product.name} is already in your wishlist.`);
        return prevItems;
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    alert('Item removed from wishlist.');
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
