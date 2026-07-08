import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import { jerseyService } from '../services';
import { Filter, Grid, List, Sparkles, X } from 'lucide-react';

const Jerseys = () => {
  const [jerseys, setJerseys] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '', sort: 'createdAt:desc' });
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchJerseys = async () => {
      try {
        setLoading(true);
        const res = await jerseyService.getAllJerseys({ page: 1, limit: 100 });
        setJerseys(res?.data?.data || []);
      } catch (error) {
        setJerseys([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJerseys();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await jerseyService.getCategories();
        setCategories(res?.data?.data || []);
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const filtered = jerseys
    .filter((item) => (filters.category ? item.category === filters.category : true))
    .filter((item) => (filters.search ? item.title?.toLowerCase().includes(filters.search.toLowerCase()) : true))
    .sort((a, b) => {
      if (filters.sort === 'price:asc') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (filters.sort === 'price:desc') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (filters.sort === 'rating:desc') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Jersey Hub</p>
            <h1 className="text-4xl sm:text-5xl font-bold">Jerseys Collection</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setFilters((prev) => ({ ...prev, sort: 'createdAt:desc' }))} className="btn-ripple rounded-lg border border-white/20 px-4 py-2 hover:border-primary transition">Newest</button>
            <button onClick={() => setFilters((prev) => ({ ...prev, sort: 'rating:desc' }))} className="btn-ripple rounded-lg border border-white/20 px-4 py-2 hover:border-primary transition">Top Rated</button>
          </div>
        </div>

        <section className="grid lg:grid-cols-4 gap-8 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 glass-card p-6 rounded-2xl">
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Filters</h2>
              <label className="block text-sm mb-2">Search</label>
              <input value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} placeholder="Search jerseys..." className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-2">Category</label>
              <select value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-400">Showing {filtered.length} jerseys</p>
                <h2 className="text-2xl font-bold">Premium Picks</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('grid')} className={`rounded-lg px-4 py-2 ${viewMode === 'grid' ? 'bg-primary text-slate-900' : 'bg-white/10'}`}>Grid</button>
                <button onClick={() => setViewMode('list')} className={`rounded-lg px-4 py-2 ${viewMode === 'list' ? 'bg-primary text-slate-900' : 'bg-white/10'}`}>List</button>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, index) => <div key={index} className="h-80 rounded-3xl loading-shimmer" />)}</div>
            ) : (
              <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'} gap-6`}>
                {filtered.map((jersey) => (
                  <motion.div key={jersey.id} whileHover={{ y: -8 }} className={viewMode === 'grid' ? '' : 'glass-card rounded-3xl p-6'}>
                    <ProductCard product={jersey} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Jerseys;
