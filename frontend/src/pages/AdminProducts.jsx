import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Copy,
  Eye,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';
import { productService, adminService } from '../services';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
const BRAND_OPTIONS = ['Adidas', 'Nike', 'Puma', 'Macron', 'Castore', 'Hummel', 'Under Armour', 'Retro'];
const CATEGORY_OPTIONS = [
  'Football Clubs',
  'National Teams',
  'Basketball Jerseys',
  'Cricket Jerseys',
  'Retro Jerseys',
  'Training Kits',
  'Limited Edition'
];
const LEAGUE_OPTIONS = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'MLS', 'IPL', 'NBA', 'International', 'Other'];
const JERSEY_TYPES = ['Home', 'Away', 'Third', 'Goalkeeper', 'Special Edition'];

const getInitialFormState = () => ({
  title: '',
  brand: '',
  category: '',
  team: '',
  league: '',
  season: '',
  jerseyType: '',
  description: '',
  price: '',
  discount: '',
  stock: '',
  sku: '',
  sizes: [],
  colors: [],
  isFeatured: false,
  isTrending: false,
  isActive: true,
  images: [] // [{url}]
});

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStock, setSelectedStock] = useState('all'); // all, low, out

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals / forms
  const [showForm, setShowForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(getInitialFormState());

  // Image upload
  const [uploadProgress, setUploadProgress] = useState(null);
  const [colorInput, setColorInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts();
      // Backend returns all products (data array)
      const data = res.data?.data || [];
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, selectedStock]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageProductIds = paginatedProducts.map(p => p.id || p._id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageProductIds])));
    } else {
      const pageProductIds = paginatedProducts.map(p => p.id || p._id);
      setSelectedIds(prev => prev.filter(id => !pageProductIds.includes(id)));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} select products?`)) {
      try {
        setLoading(true);
        await adminService.bulkDeleteProducts(selectedIds);
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id || p._id)));
        setSelectedIds([]);
        toast.success('Selected products deleted successfully');
      } catch (err) {
        toast.error('Failed to perform bulk delete');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(prev => prev.filter(p => (p.id || p._id) !== id));
        setSelectedIds(prev => prev.filter(item => item !== id));
        toast.success('Product deleted');
      } catch (err) {
        toast.error('Could not delete product');
      }
    }
  };

  const handleDuplicate = (product) => {
    setFormData({
      title: `${product.title} (Copy)`,
      brand: product.brand || '',
      category: product.category || '',
      team: product.team || '',
      league: product.league || '',
      season: product.season || '',
      jerseyType: product.jerseyType || '',
      description: product.description || '',
      price: product.price || '',
      discount: product.discount || '',
      stock: product.stock || '',
      sku: product.sku ? `${product.sku}-COPY` : '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      isFeatured: false,
      isTrending: false,
      isActive: true,
      images: product.images || []
    });
    setEditingId(null);
    setShowForm(true);
    toast.info('Product details copied. Review and Save.');
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title || '',
      brand: product.brand || '',
      category: product.category || '',
      team: product.team || '',
      league: product.league || '',
      season: product.season || '',
      jerseyType: product.jerseyType || '',
      description: product.description || '',
      price: product.price || '',
      discount: product.discount || '',
      stock: product.stock || '',
      sku: product.sku || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      isFeatured: Boolean(product.isFeatured),
      isTrending: Boolean(product.isTrending),
      isActive: product.isActive !== false,
      images: product.images || []
    });
    setEditingId(product.id || product._id);
    setShowForm(true);
  };

  // Image direct upload to storage
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadProgress(0);

    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}__${file.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `products/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(progress);
            },
            (error) => {
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedUrls.push({ url: downloadURL });
              resolve();
            }
          );
        });
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      toast.success('Images uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    const priceNum = Number(formData.price);
    const discountPercent = Number(formData.discount || 0);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    // Final price calculation
    const finalPrice = discountPercent > 0
      ? Math.round(priceNum - (priceNum * discountPercent) / 100)
      : priceNum;

    const payload = {
      title: formData.title.trim(),
      brand: formData.brand,
      category: formData.category,
      team: formData.team.trim(),
      league: formData.league,
      season: formData.season.trim(),
      jerseyType: formData.jerseyType,
      description: formData.description.trim(),
      price: priceNum,
      discount: discountPercent,
      discountPrice: finalPrice, // for compatibility
      stock: Number(formData.stock),
      sku: formData.sku.trim(),
      sizes: formData.sizes,
      colors: formData.colors,
      isFeatured: formData.isFeatured,
      isTrending: formData.isTrending,
      isActive: formData.isActive,
      images: formData.images
    };

    try {
      setLoading(true);
      if (editingId) {
        await productService.updateProduct(editingId, payload);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setFormData(getInitialFormState());
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      const apiError = error?.response?.data?.message || 'Failed to save product details';
      toast.error(apiError);
    } finally {
      setLoading(false);
    }
  };

  // Sizes toggler helper
  const handleToggleSize = (size) => {
    setFormData(prev => {
      const exist = prev.sizes.includes(size);
      const nextSizes = exist
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: nextSizes };
    });
  };

  // Custom Colors helper
  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()]
      }));
      setColorInput('');
    }
  };

  const handleRemoveColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  // Filters logic
  const filteredProducts = products.filter(product => {
    const titleMatch = (product.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory ? (product.category === selectedCategory) : true;
    const brandMatch = selectedBrand ? (product.brand === selectedBrand) : true;

    let stockMatch = true;
    if (selectedStock === 'low') {
      stockMatch = (product.stock > 0 && product.stock <= 5);
    } else if (selectedStock === 'out') {
      stockMatch = (product.stock === 0 || !product.stock);
    }

    return titleMatch && categoryMatch && brandMatch && stockMatch;
  });

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const calculatedFinalPrice = () => {
    const price = Number(formData.price || 0);
    const discount = Number(formData.discount || 0);
    if (discount > 0) {
      return Math.round(price - (price * discount) / 100);
    }
    return price;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Products Catalog</h1>
            <p className="text-[#9ba7c9] mt-1">Manage jersey details, stock configurations, and uploads.</p>
          </div>
          <button
            onClick={() => {
              setFormData(getInitialFormState());
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition shadow-lg shadow-blue-500/10"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters and Searching */}
        <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}
            <div className="md:col-span-1 relative">
              <Search className="absolute left-3.5 top-3 text-[#9ba7c9]" size={16} />
              <input
                type="text"
                placeholder="Search name, brand, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-[#aabcf5]/10 rounded-xl placeholder-[#9ba7c9] text-white text-sm focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="">All Brands</option>
              {BRAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            {/* Stock Level Filter */}
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="all">Any Stock Level</option>
              <option value="low">Low Stock (1-5)</option>
              <option value="out">Out of Stock (0)</option>
            </select>

          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl text-sm justify-between">
              <span className="font-semibold text-rose-400">{selectedIds.length} items selected</span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition text-xs"
              >
                <Trash2 size={14} />
                <span>Bulk Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Content catalog */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full glass-card border border-[#aabcf5]/10 rounded-xl loading-shimmer" />
            ))}
          </div>
        ) : (
          <div className="glass-card border border-[#aabcf5]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-[#aabcf5]/10 text-xs text-[#9ba7c9] uppercase tracking-wider font-semibold">
                    <th className="py-4 px-5 text-center w-12">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.includes(p.id || p._id))}
                      />
                    </th>
                    <th className="py-4 px-5">Product Info</th>
                    <th className="py-4 px-5">Brand</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Price</th>
                    <th className="py-4 px-5 text-center">Stock</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#aabcf5]/5 text-sm text-[#d5ddff]">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((p) => {
                      const id = p.id || p._id;
                      const hasDiscount = p.discount > 0 || (p.discountPrice && p.discountPrice < p.price);
                      const finalPrice = p.discountPrice || p.price;
                      return (
                        <tr key={id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-5 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(id)}
                              onChange={() => handleSelectRow(id)}
                            />
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                alt={p.title}
                                className="w-10 h-10 rounded-lg object-cover bg-white/5 border border-white/10"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate max-w-[200px]">{p.title}</p>
                                <p className="text-xs text-[#9ba7c9] font-mono mt-0.5">{p.sku || 'No SKU'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">{p.brand || 'Generic'}</td>
                          <td className="py-4 px-5">
                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs border border-white/5">{p.category}</span>
                          </td>
                          <td className="py-4 px-5 font-display font-semibold">
                            {hasDiscount ? (
                              <div className="flex flex-col">
                                <span className="text-white">₹{finalPrice}</span>
                                <span className="text-xs text-[#9ba7c9] line-through">₹{p.price}</span>
                              </div>
                            ) : (
                              <span>₹{p.price}</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-center font-semibold">
                            <span className={`px-2 py-0.5 rounded text-xs ${p.stock === 0
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : p.stock <= 5
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                              }`}>
                              {p.stock ?? 0}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.isActive !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'
                              }`}>
                              {p.isActive !== false ? 'Active' : 'Archived'}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setViewProduct(p)}
                                className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                                title="View details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleDuplicate(p)}
                                className="p-2 text-teal-400 hover:bg-teal-500/10 rounded-lg transition"
                                title="Duplicate product"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
                                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-[#9ba7c9]">
                        No jerseys matched your filter selections.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-[#aabcf5]/10 bg-white/5">
                <p className="text-xs text-[#9ba7c9]">
                  Showing <span className="text-white font-semibold">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="text-white font-semibold">
                    {Math.min(indexOfLastItem, totalItems)}
                  </span>{' '}
                  of <span className="text-white font-semibold">{totalItems}</span> matching products.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 px-2.5 rounded-lg border border-[#aabcf5]/10 text-sm hover:bg-white/5 transition disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`h-8 w-8 text-xs font-semibold rounded-lg transition ${currentPage === idx + 1
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-white/5 border border-[#aabcf5]/10'
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 px-2.5 rounded-lg border border-[#aabcf5]/10 text-sm hover:bg-white/5 transition disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL FORM DIALOG */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                className="glass-card border border-[#aabcf5]/15 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl relative"
              >

                {/* Modal Header */}
                <div className="sticky top-0 bg-[#090b12] border-b border-[#aabcf5]/10 p-6 flex justify-between items-center z-15">
                  <h2 className="text-2xl font-display font-extrabold tracking-tight">
                    {editingId ? 'Modify Product Specifications' : 'Register New Jersey'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-[#9ba7c9] hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                  {/* Basic Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-sm transition"
                        placeholder="e.g. Real Madrid 2026/27 Home Jersey"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">SKU / Code</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-sm transition"
                        placeholder="e.g. RM-HM-26-S"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Brand *</label>
                      <select
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select Brand</option>
                        {BRAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                        required
                      >
                        <option value="">Select Category</option>
                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Jersey Type</label>
                      <select
                        value={formData.jerseyType}
                        onChange={(e) => setFormData({ ...formData, jerseyType: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                      >
                        <option value="">Select Type</option>
                        {JERSEY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Team</label>
                      <input
                        type="text"
                        value={formData.team}
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-sm transition"
                        placeholder="e.g. Real Madrid"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">League</label>
                      <select
                        value={formData.league}
                        onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                      >
                        <option value="">Select League</option>
                        {LEAGUE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Season</label>
                      <input
                        type="text"
                        value={formData.season}
                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-sm transition"
                        placeholder="e.g. 2026/27"
                      />
                    </div>

                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Product Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-sm transition"
                      rows="3"
                      placeholder="Specify material details, dry cleaning, slim fit specifications..."
                    />
                  </div>

                  {/* Price & Stocks */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Base Price (INR) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-0 focus:border-blue-500 focus:outline-none text-sm transition"
                        placeholder="Price"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Discount %</label>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-0 focus:border-blue-500 focus:outline-none text-sm transition"
                        placeholder="0"
                        min="0"
                        max="99"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2 font-semibold text-blue-400">Calculated price</label>
                      <div className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded-xl px-4 py-2.5 text-sm">
                        ₹{calculatedFinalPrice()}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Stock Inventory *</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2.5 text-white placeholder-0 focus:border-blue-500 focus:outline-none text-sm transition"
                        placeholder="Stock amount"
                        required
                      />
                    </div>

                  </div>

                  {/* Sizes and Colors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#aabcf5]/10 pt-6">

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-3">Available Sizes</label>
                      <div className="flex flex-wrap gap-2">
                        {SIZE_OPTIONS.map(s => {
                          const active = formData.sizes.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleToggleSize(s)}
                              className={`h-10 w-12 font-bold text-xs rounded-xl flex items-center justify-center transition border ${active
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/15'
                                  : 'bg-[#121827] border-[#aabcf5]/15 text-[#9ba7c9] hover:bg-white/5 hover:text-white'
                                }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Jersey Colors</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(); } }}
                          placeholder="Type color & click +"
                          className="bg-[#121827] border border-[#aabcf5]/15 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-xs flex-1 transition"
                        />
                        <button
                          type="button"
                          onClick={handleAddColor}
                          className="h-9 w-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-[#aabcf5]/15 text-[#9ba7c9] hover:text-white font-bold text-base"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.colors.map(col => (
                          <div
                            key={col}
                            className="inline-flex items-center gap-1 bg-[#121827] border border-[#aabcf5]/10 rounded-lg px-2.5 py-1 text-xs text-[#d5ddff]"
                          >
                            <span>{col}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveColor(col)}
                              className="text-rose-400 hover:text-rose-500 ml-1 scale-105"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Flag Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#aabcf5]/10 pt-6">
                    <label className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 select-none transition">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">Featured Product</p>
                        <p className="text-[10px] text-[#9ba7c9] mt-0.5">Show in primary highlights</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 select-none transition">
                      <input
                        type="checkbox"
                        checked={formData.isTrending}
                        onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">Trending Product</p>
                        <p className="text-[10px] text-[#9ba7c9] mt-0.5">Flag as top selling jersey</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 select-none transition">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">Active Catalog</p>
                        <p className="text-[10px] text-[#9ba7c9] mt-0.5">Visible to jersey customers</p>
                      </div>
                    </label>
                  </div>

                  {/* Drag-and-Drop Image Uploader */}
                  <div className="border-t border-[#aabcf5]/10 pt-6">
                    <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Upload Product Images * (Multiple)</label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-[#aabcf5]/20 hover:border-blue-500/40 rounded-2xl p-6 transition flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/5"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.multiple = true;
                        fileInput.accept = 'image/*';
                        fileInput.onchange = (e) => handleFileUpload(e.target.files);
                        fileInput.click();
                      }}
                    >
                      <Upload size={32} className="text-[#9ba7c9]" />
                      <p className="text-sm font-semibold text-white">Drag & drop files here or click to browse</p>
                      <p className="text-xs text-[#9ba7c9]">Supports JPG, PNG, WEBP. Uploads directly to Firebase Storage.</p>

                      {uploadProgress !== null && (
                        <div className="w-full max-w-xs mt-3 bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Horizontal Scroller for previewing uploaded URLs */}
                    {formData.images.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {formData.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#aabcf5]/20 group"
                          >
                            <img
                              src={img.url}
                              alt="product upload slot"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition"
                            >
                              <X size={18} />
                            </button>
                            <span className="absolute bottom-0 left-0 right-0 text-[8px] bg-black/70 text-white py-0.5 text-center font-bold">
                              Slot {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submission triggers */}
                  <div className="flex gap-4 border-t border-[#aabcf5]/15 pt-6 sticky bottom-0 bg-[#090b12] py-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition"
                    >
                      {editingId ? 'Modify Details' : 'Register Jersey'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-[#aabcf5]/15 font-bold py-3 rounded-xl transition"
                    >
                      Cancel
                    </button>
                  </div>

                </form>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DETAILS SPECIFICATION VIEW POPUP */}
        <AnimatePresence>
          {viewProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewProduct(null)}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card border border-[#aabcf5]/15 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 p-6 relative flex flex-col gap-6"
              >

                <div className="flex justify-between items-center border-b border-[#aabcf5]/10 pb-4">
                  <h3 className="text-xl font-display font-bold text-white">Jersey Specification Sheet</h3>
                  <button
                    onClick={() => setViewProduct(null)}
                    className="text-[#9ba7c9] hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Image gallery */}
                  <div className="space-y-4">
                    <img
                      src={viewProduct.images?.[0]?.url || 'https://via.placeholder.com/250'}
                      alt={viewProduct.title}
                      className="w-full h-64 object-cover rounded-xl border border-[#aabcf5]/10"
                    />
                    <div className="flex flex-wrap gap-2">
                      {viewProduct.images?.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt="jersey slot"
                          className="w-12 h-12 object-cover rounded-lg border border-[#aabcf5]/10"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Attributes detail */}
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="text-lg font-bold text-white font-display">{viewProduct.title}</h4>
                      <p className="text-xs text-[#9ba7c9] mt-1 font-mono">SKU: {viewProduct.sku || 'No SKU code'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-y border-[#aabcf5]/10 py-3">
                      <p><span className="text-[#9ba7c9]">Brand:</span> <span className="font-semibold text-white">{viewProduct.brand || 'Generic'}</span></p>
                      <p><span className="text-[#9ba7c9]">Category:</span> <span className="font-semibold text-white">{viewProduct.category}</span></p>
                      <p><span className="text-[#9ba7c9]">Team:</span> <span className="font-semibold text-white">{viewProduct.team || 'None'}</span></p>
                      <p><span className="text-[#9ba7c9]">League:</span> <span className="font-semibold text-white">{viewProduct.league || 'None'}</span></p>
                      <p><span className="text-[#9ba7c9]">Season:</span> <span className="font-semibold text-white">{viewProduct.season || 'None'}</span></p>
                      <p><span className="text-[#9ba7c9]">Type:</span> <span className="font-semibold text-white">{viewProduct.jerseyType || 'None'}</span></p>
                    </div>

                    <div>
                      <span className="text-[#9ba7c9] text-xs block mb-1">Sizes:</span>
                      <div className="flex gap-1">
                        {viewProduct.sizes?.map(s => (
                          <span key={s} className="bg-white/5 border border-white/10 px-2 py-0.5 text-xs rounded text-white font-semibold">{s}</span>
                        )) || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#9ba7c9] text-xs block mb-1">Colors:</span>
                      <div className="flex flex-wrap gap-1">
                        {viewProduct.colors?.map(c => (
                          <span key={c} className="bg-[#121827] border border-white/5 px-2 py-0.5 text-xs rounded text-[#d5ddff]">{c}</span>
                        )) || 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#aabcf5]/10 pt-4">
                      <div>
                        <span className="text-[#9ba7c9] text-xs block">Price Tag:</span>
                        <span className="text-xl font-bold font-display text-white">₹{viewProduct.discountPrice || viewProduct.price}</span>
                        {viewProduct.discount > 0 && <span className="text-xs text-[#9ba7c9] line-through ml-2">₹{viewProduct.price}</span>}
                      </div>
                      <div className="text-right">
                        <span className="text-[#9ba7c9] text-xs block">Stock:</span>
                        <span className="font-bold text-white text-base">{viewProduct.stock} Left</span>
                      </div>
                    </div>

                  </div>

                </div>

                <p className="text-xs text-[#9ba7c9] border-t border-[#aabcf5]/10 pt-3">
                  <span className="font-bold uppercase">Description: </span>
                  {viewProduct.description || 'No product catalog description provided.'}
                </p>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
