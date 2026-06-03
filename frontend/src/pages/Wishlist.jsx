import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition"
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
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.products.map((item) => (
            <motion.div
              key={item.productId._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={item.productId} />
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Wishlist;
