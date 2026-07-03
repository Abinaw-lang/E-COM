import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, updateCartItem, removeFromCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart || cart.products.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-primary to-accent text-slate-900 px-8 py-3 rounded-lg hover:shadow-neon transition font-bold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-lg p-6">
              {cart.products.map((item) => (
                <motion.div
                  key={item.productId._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b pb-4 mb-4 flex gap-4"
                >
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.productId.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productId.title}</h3>
                    <p className="text-primary text-lg font-bold">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartItem(item.productId._id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.productId._id, item.quantity + 1)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId._id)}
                        className="ml-auto p-2 text-red-400 hover:bg-red-500/10 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-2xl p-6 sticky top-20 border border-primary/25">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cart.totalPrice * 0.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-slate-300">2-4 days</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(cart.totalPrice * 1.05)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-primary to-accent text-slate-900 py-3 rounded-lg hover:shadow-neon transition font-bold"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-primary text-primary py-3 rounded-lg hover:bg-primary hover:text-white transition"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
