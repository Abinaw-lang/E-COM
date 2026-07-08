import { createContext, useContext, useState, useEffect } from 'react';
import { cartService, firestoreService, productService } from '../services';
import { auth } from '../firebase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (auth && auth.currentUser && firestoreService.getCartForUser) {
        const uid = auth.currentUser.uid;
        const docs = await firestoreService.getCartForUser(uid);
        // normalize to { products: [...], totalPrice }
        const products = docs.map((d) => ({ id: d.id, productId: d.product, quantity: d.quantity || 1, price: d.price || d.product?.price || 0, image: d.image || d.product?.images?.[0]?.url }));
        const totalPrice = products.reduce((s, p) => s + (p.price || 0) * (p.quantity || 1), 0);
        setCart({ products, totalPrice });
      } else {
        const response = await cartService.getCart();
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (auth && auth.currentUser && firestoreService.addToCart) {
        const uid = auth.currentUser.uid;
        // try to get full product
        let product = null;
        try {
          product = (await firestoreService.getProductById(productId)) || (await productService.getProductById(productId)).data.data;
        } catch (err) {
          product = { id: productId };
        }
        await firestoreService.addToCart(uid, { productId: product.id || product._id || productId, product, quantity, price: product.discountPrice || product.price || 0, image: product.images?.[0]?.url || '' });
        await fetchCart();
        return { success: true };
      }
      const response = await cartService.addToCart({ productId, quantity });
      setCart(response.data.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (auth && auth.currentUser && firestoreService.updateCartItemByProduct) {
        const uid = auth.currentUser.uid;
        await firestoreService.updateCartItemByProduct(uid, productId, { quantity });
        await fetchCart();
        return { success: true };
      }
      const response = await cartService.updateCartItem(productId, { quantity });
      setCart(response.data.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (auth && auth.currentUser && firestoreService.removeFromCartByProduct) {
        const uid = auth.currentUser.uid;
        await firestoreService.removeFromCartByProduct(uid, productId);
        await fetchCart();
        return { success: true };
      }
      const response = await cartService.removeFromCart(productId);
      setCart(response.data.data);
      return response.data;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
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
