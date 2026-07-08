import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService, firestoreService } from '../services';
import { auth } from '../firebase';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      if (auth && auth.currentUser && firestoreService.getWishlistForUser) {
        const uid = auth.currentUser.uid;
        const docs = await firestoreService.getWishlistForUser(uid);
        // normalize to existing shape { products: [{ productId: {...} }] }
        const products = docs.map((d) => ({ id: d.id, productId: d.product }));
        setWishlist({ products });
      } else {
        const response = await wishlistService.getWishlist();
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      if (auth && auth.currentUser && firestoreService.addToWishlist) {
        const uid = auth.currentUser.uid;
        // try to fetch product details if productId is an object or id
        const product = typeof productId === 'object' ? productId : { id: productId };
        await firestoreService.addToWishlist(uid, product);
        await fetchWishlist();
        return { success: true };
      }
      const response = await wishlistService.addToWishlist({ productId });
      setWishlist(response.data.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (auth && auth.currentUser && firestoreService.removeFromWishlistByProduct) {
        const uid = auth.currentUser.uid;
        await firestoreService.removeFromWishlistByProduct(uid, productId);
        await fetchWishlist();
        return { success: true };
      }
      const response = await wishlistService.removeFromWishlist(productId);
      setWishlist(response.data.data);
      return response.data;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
