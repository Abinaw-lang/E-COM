import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/helpers';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  useEffect(() => {
    if (!cart || cart.products.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create order
      const orderRes = await orderService.createOrder({
        products: cart.products,
        shippingAddress: formData,
        billingAddress: formData
      });

      const orderId = orderRes.data.data._id;

      // Create Razorpay order
      const razorpayRes = await orderService.createRazorpayOrder({
        amount: cart.totalPrice,
        orderId
      });

      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: cart.totalPrice * 100,
        currency: 'INR',
        name: 'EStore',
        description: 'Product Purchase',
        order_id: razorpayRes.data.data.id,
        handler: async (response) => {
          try {
            await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            });
            toast.success('Payment successful!');
            await clearCart();
            navigate(`/orders/${orderId}`, {
              state: {
                paymentSuccess: true,
                trackingCode: `JH-${String(orderId).slice(-6).toUpperCase()}`
              }
            });
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone
        }
      };

      const Razorpay = window.Razorpay;
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {['Shipping', 'Payment', 'Review', 'Confirmation'].map((step, index) => (
            <div
              key={step}
              className={`rounded-lg px-4 py-3 text-center text-sm font-semibold border ${index < 2 ? 'border-primary bg-primary/10 text-primary' : 'border-white/15 text-slate-300'}`}
            >
              {index + 1}. {step}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>India</option>
                      <option>USA</option>
                      <option>UK</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Stripe', 'Razorpay', 'UPI', 'Card', 'Wallet'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-lg px-3 py-2 border text-sm ${paymentMethod === method ? 'border-primary bg-primary/10 text-primary' : 'border-white/20 text-slate-200'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent text-slate-900 py-3 rounded-lg hover:shadow-neon transition font-bold disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Proceed to ${paymentMethod}`}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cart.products.map((item) => (
                  <div key={item.productId._id} className="flex justify-between text-sm">
                    <span>{item.productId.title} x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
