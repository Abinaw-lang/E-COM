import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import { productService } from '../services';
import { mockJerseys } from '../data/mockJerseys';
import { Filter, Grid, List, Sparkles, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 1000,
    maxPrice: 9000,
    search: '',
    sort: 'createdAt:desc',
    color: '',
    brand: '',
    league: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [compareItems, setCompareItems] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showRecent, setShowRecent] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getAllProducts(filters);
        const incoming = res?.data?.data?.length ? res.data.data : mockJerseys;
        setProducts(incoming);
      } catch (error) {
        setProducts(mockJerseys);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res?.data?.data?.length ? res.data.data : [...new Set(mockJerseys.map((item) => item.category))]);
      } catch (error) {
        setCategories([...new Set(mockJerseys.map((item) => item.category))]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(recent.slice(0, 4));

    const compare = JSON.parse(localStorage.getItem('compareProducts') || '[]');
    setCompareItems(compare.slice(0, 3));
  }, []);

  const availableColors = [...new Set(products.flatMap((item) => item.colors || []))];
  const availableBrands = [...new Set(products.map((item) => item.brand).filter(Boolean))];
  const availableLeagues = [...new Set(products.map((item) => item.league).filter(Boolean))];

  const filteredProducts = products
    .filter((item) => (filters.category ? item.category === filters.category : true))
    .filter((item) => (filters.search ? item.title?.toLowerCase().includes(filters.search.toLowerCase()) : true))
    .filter((item) => {
      const price = item.discountPrice || item.price;
      return price >= Number(filters.minPrice) && price <= Number(filters.maxPrice);
    })
    .filter((item) => (filters.color ? item.colors?.includes(filters.color) : true))
    .filter((item) => (filters.brand ? item.brand === filters.brand : true))
    .filter((item) => (filters.league ? item.league === filters.league : true))
    .sort((a, b) => {
      if (filters.sort === 'price:asc') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (filters.sort === 'price:desc') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (filters.sort === 'rating:desc') return (b.rating || 0) - (a.rating || 0);
      if (filters.sort === 'discount:desc') {
        const discountA = a.discountPrice ? ((a.price - a.discountPrice) / a.price) * 100 : 0;
        const discountB = b.discountPrice ? ((b.price - b.discountPrice) / b.price) * 100 : 0;
        return discountB - discountA;
      }
      return 0;
    });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCompare = (product) => {
    setCompareItems((prev) => {
      const already = prev.some((item) => item._id === product._id);
      if (already) return prev;
      const next = [...prev, product].slice(0, 3);
      localStorage.setItem('compareProducts', JSON.stringify(next));
      return next;
    });
  };

  const removeCompare = (id) => {
    setCompareItems((prev) => {
      const next = prev.filter((item) => item._id !== id);
      localStorage.setItem('compareProducts', JSON.stringify(next));
      return next;
    });
  };

  const aiRecommendations = [...filteredProducts]
    .sort((a, b) => {
      const scoreA = (a.rating || 0) * 10 + (a.discountPrice ? ((a.price - a.discountPrice) / a.price) * 100 : 0);
      const scoreB = (b.rating || 0) * 10 + (b.discountPrice ? ((b.price - b.discountPrice) / b.price) * 100 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 3);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">Shop Jerseys</h1>
        <p className="text-slate-300 mb-8">Advanced search, filters, and premium collections for every league and fan.</p>

        <section className="glass-card rounded-2xl p-5 sm:p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h2 className="font-display text-2xl">AI Jersey Recommendations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {aiRecommendations.map((item) => (
              <div key={item._id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <img src={item.images?.[0]?.url} alt={item.title} className="h-32 w-full rounded-lg object-cover mb-3" />
                <p className="font-semibold line-clamp-1">{item.title}</p>
                <p className="text-sm text-slate-300 line-clamp-1">Best match by rating, discount, and trend.</p>
                <button
                  type="button"
                  onClick={() => handleCompare(item)}
                  className="mt-3 rounded-md border border-primary/40 px-3 py-1 text-sm text-primary hover:bg-primary hover:text-slate-900 transition"
                >
                  Add to Compare
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Filter size={20} /> Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Price Range</label>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm">Min Price: ₹{filters.minPrice}</label>
                    <input
                      type="range"
                      min="1000"
                      max="9000"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Max Price: ₹{filters.maxPrice}</label>
                    <input
                      type="range"
                      min="1000"
                      max="9000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">Color</label>
                <select
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Colors</option>
                  {availableColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Brands</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">League</label>
                <select
                  value={filters.league}
                  onChange={(e) => handleFilterChange('league', e.target.value)}
                  className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Leagues</option>
                  {availableLeagues.map((league) => (
                    <option key={league} value={league}>
                      {league}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block font-semibold mb-2">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-2 border border-white/20 bg-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="createdAt:desc">Newest</option>
                  <option value="rating:desc">Popularity</option>
                  <option value="discount:desc">Discount</option>
                  <option value="price:asc">Price: Low to High</option>
                  <option value="price:desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex justify-end gap-2 mb-6">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-slate-900' : 'bg-white/10'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-slate-900' : 'bg-white/10'}`}
              >
                <List size={20} />
              </button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-[390px] rounded-2xl loading-shimmer" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} onCompare={handleCompare} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-slate-300">No products found</p>
              </div>
            )}
          </div>
        </div>

        {showRecent && recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-6 z-30 hidden max-w-xs rounded-xl border border-white/10 bg-[#0a0f1d]/95 p-3 shadow-premium md:block"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">Recently Viewed</p>
              <button type="button" onClick={() => setShowRecent(false)} className="text-slate-400 hover:text-white">
                <X size={15} />
              </button>
            </div>
            <div className="space-y-2">
              {recentlyViewed.slice(0, 2).map((item) => (
                <div key={item._id} className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
                  <img src={item.images?.[0]?.url} alt={item.title} className="h-10 w-10 rounded object-cover" />
                  <p className="line-clamp-1 text-sm text-slate-200">{item.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {compareItems.length > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#05080f]/95 backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
              <p className="text-sm font-semibold text-primary whitespace-nowrap">Compare ({compareItems.length}/3)</p>
              <div className="flex flex-1 gap-3 overflow-x-auto">
                {compareItems.map((item) => (
                  <div key={item._id} className="flex min-w-[220px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
                    <img src={item.images?.[0]?.url} alt={item.title} className="h-12 w-12 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-300">Rating {item.rating || 0}</p>
                    </div>
                    <button type="button" onClick={() => removeCompare(item._id)} className="text-slate-400 hover:text-red-400">
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Products;
