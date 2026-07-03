import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import JerseyHeroScene from '../components/JerseyHeroScene';
import AmbientEffects from '../components/AmbientEffects';
import { productService } from '../services';
import { mockJerseys } from '../data/mockJerseys';
import { ArrowDown, ChevronRight, Package, Truck, Shield, Sparkles, Zap } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        const products = response?.data?.data?.length ? response.data.data : mockJerseys;
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        setFeaturedProducts(mockJerseys.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      '.scroll-cue',
      { y: 0, opacity: 0.3 },
      { y: 14, opacity: 1, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' }
    );
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative min-h-[92vh] overflow-hidden"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setCursor({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100
          });
        }}
      >
        <AmbientEffects />
        <div
          className="pointer-events-none absolute h-44 w-44 rounded-full blur-3xl bg-primary/35"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%`, transform: 'translate(-50%, -50%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <div className="premium-chip inline-flex items-center gap-2 mb-5">
              <Sparkles size={14} /> Luxury Sportswear Experience
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.03] tracking-tight mb-5">
              WEAR THE GAME
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-slate-200/85 max-w-xl">
              Premium football jerseys for every fan. Engineered fabrics, elite cuts, and club-inspired heritage in one futuristic shop.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/products')}
                className="btn-ripple rounded-xl bg-gradient-to-r from-primary to-accent text-slate-900 px-8 py-3.5 font-bold hover:shadow-neon transition flex items-center gap-2"
              >
                Shop Now <ChevronRight size={20} />
              </button>
              <button
                onClick={() => navigate('/collections')}
                className="btn-ripple rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 font-semibold hover:border-primary hover:text-primary transition"
              >
                Explore Collections
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-10 max-w-2xl">
              {[
                { label: 'Limited Drops', value: '120+' },
                { label: 'Global Clubs', value: '42' },
                { label: 'Fan Rating', value: '4.9/5' }
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl px-4 py-3">
                  <p className="font-display text-2xl text-primary">{item.value}</p>
                  <p className="text-sm text-slate-300/85">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-2 sm:p-4 border border-white/15 shadow-premium">
            <JerseyHeroScene />
            <div className="px-4 pb-4 flex items-center justify-between">
              <p className="text-sm text-slate-300">Rotating 3D Jersey Preview</p>
              <span className="premium-chip text-xs inline-flex items-center gap-1">
                <Zap size={12} /> Live Motion
              </span>
            </div>
          </div>
        </div>

        <div className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-100/75 flex flex-col items-center gap-1">
          <ArrowDown size={18} />
          <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="text-center glass-card rounded-2xl p-8">
              <Truck className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-slate-300">On orders over ₹500</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="text-center glass-card rounded-2xl p-8">
              <Shield className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-slate-300">Razorpay, Stripe, UPI, Cards, Wallet</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="text-center glass-card rounded-2xl p-8">
              <Package className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-slate-300">30-day premium support and return policy</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Top Picks</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Featured Jerseys</h2>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="btn-ripple rounded-lg border border-primary/45 px-5 py-2 hover:bg-primary hover:text-slate-900 transition"
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-[390px] rounded-2xl loading-shimmer" />
            ))}
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
        className="glass-card py-16 rounded-3xl mb-16 max-w-7xl mx-auto px-4 border border-white/10"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Flash Sale Countdown Live</h2>
          <p className="text-xl mb-6 text-slate-200">Get up to 50% off on selected clubs, retro drops, and limited kits.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-ripple bg-gradient-to-r from-primary to-accent text-slate-900 px-8 py-3 rounded-lg font-semibold hover:shadow-neon transition"
          >
            Explore Flash Deals
          </button>
        </div>
      </motion.section>
    </MainLayout>
  );
};

export default Home;
