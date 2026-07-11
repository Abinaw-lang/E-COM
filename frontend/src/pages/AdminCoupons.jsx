import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Ticket,
    X,
    Calendar,
    AlertTriangle,
    Percent,
    Check
} from 'lucide-react';
import { couponService } from '../services';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const getInitialFormState = () => ({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    expiryDate: '',
    isActive: true
});

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(getInitialFormState());

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await couponService.getAllCoupons();
            setCoupons(res.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await couponService.deleteCoupon(id);
                setCoupons(prev => prev.filter(c => (c.id || c._id) !== id));
                toast.success('Coupon deleted successfully');
            } catch (err) {
                toast.error('Failed to delete coupon');
            }
        }
    };

    const handleEdit = (coupon) => {
        // Format expiry date for input type="date"
        let expiry = '';
        if (coupon.expiryDate) {
            const dateObj = coupon.expiryDate.toDate
                ? coupon.expiryDate.toDate()
                : new Date(coupon.expiryDate);
            if (!isNaN(dateObj.getTime())) {
                expiry = dateObj.toISOString().split('T')[0];
            }
        }

        setFormData({
            code: coupon.code || '',
            discountType: coupon.discountType || 'percentage',
            discountValue: coupon.discountValue || '',
            minOrderAmount: coupon.minOrderAmount || '',
            maxUses: coupon.maxUses || '',
            expiryDate: expiry,
            isActive: coupon.isActive !== false
        });
        setEditingId(coupon.id || coupon._id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.code.trim()) {
            toast.error('Coupon code is required');
            return;
        }

        const payload = {
            code: formData.code.trim().toUpperCase(),
            discountType: formData.discountType,
            discountValue: Number(formData.discountValue),
            minOrderAmount: Number(formData.minOrderAmount || 0),
            maxUses: formData.maxUses ? Number(formData.maxUses) : null,
            expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
            isActive: formData.isActive
        };

        if (payload.discountType === 'percentage' && payload.discountValue > 100) {
            toast.error('Percentage discount cannot exceed 100%');
            return;
        }

        try {
            setLoading(true);
            if (editingId) {
                const res = await couponService.updateCoupon(editingId, payload);
                toast.success('Coupon updated successfully');
            } else {
                const res = await couponService.createCoupon(payload);
                toast.success('Coupon created successfully');
            }
            setShowForm(false);
            setFormData(getInitialFormState());
            setEditingId(null);
            fetchCoupons();
        } catch (err) {
            const apiErr = err.response?.data?.message || 'Failed to save coupon details';
            toast.error(apiErr);
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
                        <h1 className="text-3xl font-display font-extrabold tracking-tight">Voucher Management</h1>
                        <p className="text-[#9ba7c9] mt-1">Configure checkouts checkout coupons, percentage discounts, and usage caps.</p>
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
                        <span>Create Coupon</span>
                    </button>
                </div>

                {/* Content list */}
                {loading && coupons.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-44 w-full glass-card border border-[#aabcf5]/10 rounded-2xl loading-shimmer" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map((c) => {
                            const id = c.id || c._id;

                            // Expiry Check
                            let isExpired = false;
                            let expiryString = 'Never';
                            if (c.expiryDate) {
                                const dateObj = c.expiryDate.toDate ? c.expiryDate.toDate() : new Date(c.expiryDate);
                                if (!isNaN(dateObj.getTime())) {
                                    expiryString = dateObj.toLocaleDateString();
                                    isExpired = dateObj < new Date();
                                }
                            }

                            return (
                                <motion.div
                                    key={id}
                                    whileHover={{ y: -4 }}
                                    className="glass-card border border-[#aabcf5]/10 rounded-2xl overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-450 text-blue-400">
                                                    <Ticket size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold font-mono tracking-wider text-white">{c.code}</h3>
                                                    <span className={`text-[10px] font-bold ${c.discountType === 'percentage' ? 'text-teal-400' : 'text-indigo-400'
                                                        }`}>
                                                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.isActive !== false && !isExpired
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                                                }`}>
                                                {isExpired ? 'Expired' : c.isActive !== false ? 'Active' : 'Disabled'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-2 text-xs text-[#d5ddff] pt-2 border-t border-[#aabcf5]/5">
                                            <p><span className="text-[#9ba7c9]">Min Spend:</span> <span className="font-semibold text-white">₹{c.minOrderAmount || 0}</span></p>
                                            <p><span className="text-[#9ba7c9]">Redeemed:</span> <span className="font-semibold text-white">{c.usedCount || 0} / {c.maxUses || '∞'}</span></p>
                                            <p className="col-span-2 flex items-center gap-1.5 mt-1 text-[11px] text-[#9ba7c9]">
                                                <Calendar size={13} className={isExpired ? 'text-rose-400' : 'text-[#9ba7c9]'} />
                                                <span className={isExpired ? 'text-rose-400 font-bold' : ''}>
                                                    Expires: {expiryString}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-[#aabcf5]/5 flex items-center justify-end gap-2 bg-[#121827]/30">
                                        <button
                                            onClick={() => handleEdit(c)}
                                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold bg-[#121827] border border-blue-500/20 px-3 py-1.5 rounded-lg transition"
                                        >
                                            <Edit2 size={12} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(id)}
                                            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-bold bg-[#121827] border border-rose-500/20 px-3 py-1.5 rounded-lg transition"
                                        >
                                            <Trash2 size={12} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {coupons.length === 0 && (
                            <div className="col-span-full glass-card border border-[#aabcf5]/10 rounded-2xl p-8 text-center text-[#9ba7c9] flex flex-col items-center gap-2">
                                <Ticket size={40} className="text-[#aabcf5]/40" />
                                <p className="text-sm font-semibold">No voucher codes created yet</p>
                                <p className="text-xs text-[#9ba7c9]/80">Generate promo codes to capture seasonal checkout boost campaigns.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Form Modal */}
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
                                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-1.5">
                                        <Ticket size={18} className="text-blue-400" />
                                        <span>{editingId ? 'Modify Coupon' : 'Create Coupon'}</span>
                                    </h3>
                                    <button onClick={() => setShowForm(false)} className="text-[#9ba7c9] hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2 font-mono">Coupon Promo Code *</label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition uppercase font-mono tracking-widest"
                                            placeholder="e.g. JERSEYS50"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Discount Type</label>
                                            <select
                                                value={formData.discountType}
                                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                                className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="fixed">Fixed Rate (INR)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Discount Value *</label>
                                            <input
                                                type="number"
                                                value={formData.discountValue}
                                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                                className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                                                placeholder={formData.discountType === 'percentage' ? 'e.g. 15' : 'e.g. 500'}
                                                required
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Min Spend (INR)</label>
                                            <input
                                                type="number"
                                                value={formData.minOrderAmount}
                                                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                                className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-3 py-2 text-xs text-white"
                                                placeholder="e.g. 999"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Limit Overall Uses</label>
                                            <input
                                                type="number"
                                                value={formData.maxUses}
                                                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                                className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-3 py-2 text-xs text-white"
                                                placeholder="e.g. 100 (Blank = ∞)"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
                                        />
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
                                            <p className="text-[10px] text-[#9ba7c9] mt-0.5">Voucher code is immediately redeemable</p>
                                        </div>
                                    </label>

                                    <div className="flex gap-3 pt-4 border-t border-[#aabcf5]/15">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl transition text-sm"
                                        >
                                            Save Coupon
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

export default AdminCoupons;
