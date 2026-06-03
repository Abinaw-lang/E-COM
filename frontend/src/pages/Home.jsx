import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import { ChevronRight, Package, Truck, Shield, Star } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary to-secondary text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-bold mb-4">Welcome to EStore</h1>
            <p className="text-xl mb-6 text-gray-200">
              Discover amazing products at unbeatable prices. Shop with confidence.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
            >
              Shop Now <ChevronRight size={20} />
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://via.placeholder.com/500x400?text=Hero+Image"
              alt="Hero"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="text-center">
              <Truck className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">On orders over ₹500</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="text-center">
              <Shield className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">100% safe transactions</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="text-center">
              <Package className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600 dark:text-gray-400">30 days money back guarantee</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Featured Products</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-secondary to-primary text-white py-16 rounded-lg mb-16 max-w-7xl mx-auto px-4"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Special Summer Sale!</h2>
          <p className="text-xl mb-6">Get up to 50% off on selected items</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Sale Items
          </button>
        </div>
      </motion.section>
    </MainLayout>
  );
};

export default Home;
