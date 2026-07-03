import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, fetchCart, updateCartItem, removeFromCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const cartProducts = cart?.products || [];
  const subtotal = cart?.totalPrice || 0;
  const tax = subtotal * 0.05;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close cart drawer"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 170, damping: 20 }}
            className="fixed right-0 top-0 z-[80] h-full w-full max-w-md border-l border-white/10 bg-[#070b16]/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl">Your Cart</h2>
                <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {cartProducts.length === 0 ? (
                  <div className="glass-card mt-12 rounded-2xl p-8 text-center">
                    <ShoppingBag className="mx-auto mb-3 text-primary" size={30} />
                    <p className="text-slate-300">Your cart is empty.</p>
                  </div>
                ) : (
                  cartProducts.map((item) => (
                    <div key={item.productId?._id || item._id} className="glass-card rounded-xl p-3">
                      <div className="flex gap-3">
                        <img
                          src={item.image || item.productId?.images?.[0]?.url || '/placeholder.jpg'}
                          alt={item.productId?.title || 'Product'}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-white">
                            {item.productId?.title || 'Premium Jersey'}
                          </p>
                          <p className="mt-1 text-sm text-primary">{formatPrice(item.price || 0)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateCartItem(item.productId._id, Math.max(1, item.quantity - 1))}
                              className="rounded-md border border-white/20 p-1 hover:bg-white/10"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartItem(item.productId._id, item.quantity + 1)}
                              className="rounded-md border border-white/20 p-1 hover:bg-white/10"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId._id)}
                              className="ml-auto rounded-md p-1 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-1 flex justify-between text-sm text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="mb-1 flex justify-between text-sm text-slate-300">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal + tax)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  disabled={cartProducts.length === 0}
                  className="mt-3 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-bold text-slate-900 transition hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Checkout
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
