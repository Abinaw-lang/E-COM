import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const collections = [
  { title: 'Football Clubs', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80' },
  { title: 'National Teams', image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Basketball Jerseys', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Cricket Jerseys', image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Retro Jerseys', image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Training Kits', image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Limited Edition', image: 'https://images.unsplash.com/photo-1628891890467-b79de7f6b7d9?auto=format&fit=crop&w=1200&q=80' }
];

const Collections = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h1 className="font-display text-4xl sm:text-5xl mb-3">Collections</h1>
        <p className="text-slate-300 mb-10">Curated premium categories for fans, athletes, and collectors.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((item, index) => (
            <motion.button
              key={item.title}
              type="button"
              onClick={() => navigate('/products')}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10"
            >
              <img src={item.image} alt={item.title} className="h-60 w-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-left">
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="text-sm text-slate-200">View category</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Collections;
