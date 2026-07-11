import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Upload,
    X,
    Layers,
    Check,
    AlertTriangle
} from 'lucide-react';
import { adminService } from '../services';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const getInitialFormState = () => ({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true
});

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(getInitialFormState());
    const [uploadProgress, setUploadProgress] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await adminService.getCategories();
            setCategories(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await adminService.deleteCategory(id);
                setCategories(prev => prev.filter(c => (c.id || c._id) !== id));
                toast.success('Category deleted successfully');
            } catch (err) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name || '',
            description: category.description || '',
            imageUrl: category.imageUrl || '',
            isActive: category.isActive !== false
        });
        setEditingId(category.id || category._id);
        setShowForm(true);
    };

    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        setUploadProgress(0);

        try {
            const fileName = `${Date.now()}_cat_${file.name.replace(/\s+/g, '_')}`;
            const storageRef = ref(storage, `categories/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setUploadProgress(progress);
                    },
                    (error) => reject(error),
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
                        resolve();
                    }
                );
            });
            toast.success('Category banner uploaded');
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload category image');
        } finally {
            setUploadProgress(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                const res = await adminService.updateCategory(editingId, formData);
                setCategories(prev => prev.map(c => (c.id || c._id) === editingId ? res.data.data : c));
                toast.success('Category updated successfully');
            } else {
                const res = await adminService.createCategory(formData);
                setCategories(prev => [...prev, res.data.data]);
                toast.success('Category created successfully');
            }
            setShowForm(false);
            setFormData(getInitialFormState());
            setEditingId(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-extrabold tracking-tight">Category Catalog</h1>
                        <p className="text-[#9ba7c9] mt-1">Classify your products and manage category configurations.</p>
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
                        <span>Create Category</span>
                    </button>
                </div>

                {/* Content list */}
                {loading && categories.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-48 w-full glass-card border border-[#aabcf5]/10 rounded-2xl loading-shimmer" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((c) => {
                            const id = c.id || c._id;
                            return (
                                <motion.div
                                    key={id}
                                    whileHover={{ y: -4 }}
                                    className="glass-card border border-[#aabcf5]/10 rounded-2xl overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-40 bg-white/5 border-b border-[#aabcf5]/10">
                                            {c.imageUrl ? (
                                                <img
                                                    src={c.imageUrl}
                                                    alt={c.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#9ba7c9] bg-gradient-to-br from-[#090b12] to-[#121827]">
                                                    <Layers size={36} />
                                                </div>
                                            )}
                                            <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.isActive !== false
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-gray-500/25 text-gray-300 border border-gray-500/20'
                                                }`}>
                                                {c.isActive !== false ? 'Active' : 'Hidden'}
                                            </span>
                                        </div>

                                        <div className="p-5 space-y-2">
                                            <h3 className="text-xl font-bold font-display text-white">{c.name}</h3>
                                            <p className="text-xs text-[#9ba7c9] line-clamp-2 h-8">
                                                {c.description || 'No description provided for this category.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-5 border-t border-[#aabcf5]/5 flex items-center justify-end gap-2 bg-[#121827]/30">
                                        <button
                                            onClick={() => handleEdit(c)}
                                            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold bg-[#121827] border border-blue-500/20 px-3 py-1.5 rounded-lg transition"
                                        >
                                            <Edit2 size={13} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(id)}
                                            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold bg-[#121827] border border-rose-500/20 px-3 py-1.5 rounded-lg transition"
                                        >
                                            <Trash2 size={13} />
                                            <span>Delete</span>
                                        </button>
                                    </div>

                                </motion.div>
                            );
                        })}

                        {categories.length === 0 && (
                            <div className="col-span-full glass-card border border-[#aabcf5]/10 rounded-2xl p-8 text-center text-[#9ba7c9] flex flex-col items-center gap-2">
                                <Layers size={40} className="text-[#aabcf5]/40" />
                                <p className="text-sm font-semibold">No custom categories created yet</p>
                                <p className="text-xs text-[#9ba7c9]/80">Create categories to classify your jerseys under team, league or sports.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Categories Dialog */}
                <AnimatePresence>
                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowForm(false)}
                                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card border border-[#aabcf5]/15 rounded-2xl w-full max-w-md overflow-hidden z-10 shadow-2xl relative"
                            >
                                <div className="p-6 border-b border-[#aabcf5]/10 flex justify-between items-center bg-[#090b12]">
                                    <h3 className="text-xl font-display font-bold text-white">
                                        {editingId ? 'Modify Category' : 'Create Category'}
                                    </h3>
                                    <button onClick={() => setShowForm(false)} className="text-[#9ba7c9] hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Category Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                                            placeholder="e.g. Retro Jerseys"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                                            rows="3"
                                            placeholder="Categorize jerseys by decades or limited releases..."
                                        />
                                    </div>

                                    {/* Banner Image upload */}
                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Category Banner (Optional)</label>
                                        <div
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                                            onClick={() => {
                                                const fileInput = document.createElement('input');
                                                fileInput.type = 'file';
                                                fileInput.accept = 'image/*';
                                                fileInput.onchange = (e) => handleFileUpload(e.target.files);
                                                fileInput.click();
                                            }}
                                            className="border-2 border-dashed border-[#aabcf5]/20 hover:border-blue-500/40 rounded-xl p-4 transition flex flex-col items-center justify-center gap-1 cursor-pointer bg-white/5"
                                        >
                                            <Upload size={20} className="text-[#9ba7c9]" />
                                            <p className="text-xs text-white font-semibold">Click to upload Category image banner</p>
                                            {uploadProgress !== null && (
                                                <div className="w-full max-w-[120px] bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                                                    <div className="bg-blue-500 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                                                </div>
                                            )}
                                        </div>

                                        {formData.imageUrl && (
                                            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#aabcf5]/20 mt-3">
                                                <img src={formData.imageUrl} alt="banner thumbnail" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                    className="absolute top-1.5 right-1.5 bg-black/60 text-rose-400 p-1 rounded-lg hover:text-rose-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <label className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 select-none transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-white">Active Status</p>
                                            <p className="text-[10px] text-[#9ba7c9] mt-0.5">Allow listing products in this category</p>
                                        </div>
                                    </label>

                                    <div className="flex gap-3 pt-4 border-t border-[#aabcf5]/15">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl transition text-sm"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 bg-white/5 hover:bg-white/10 border border-[#aabcf5]/15 text-white font-bold py-2.5 rounded-xl transition text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
