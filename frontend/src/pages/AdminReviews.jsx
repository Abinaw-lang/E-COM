import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Star,
    Trash2,
    Eye,
    EyeOff,
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import { adminService } from '../services';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllReviews();
            setReviews(res.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load reviews list');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleHide = async (rev) => {
        const id = rev.id || rev._id;
        const currentIsHidden = rev.isHidden === true;
        const nextStatus = currentIsHidden ? 'make visible' : 'hide';

        if (window.confirm(`Are you sure you want to ${nextStatus} this review?`)) {
            try {
                await adminService.toggleHideReview(id);
                setReviews(prev => prev.map(r => {
                    if ((r.id || r._id) === id) {
                        return { ...r, isHidden: !currentIsHidden };
                    }
                    return r;
                }));
                toast.success(`Review successfully ${currentIsHidden ? 'unblocked' : 'flagged as hidden'}`);
            } catch (err) {
                console.error(err);
                toast.error('Failed to moderate review status');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this review permanently?')) {
            try {
                await adminService.deleteReview(id);
                setReviews(prev => prev.filter(r => (r.id || r._id) !== id));
                toast.success('Review deleted successfully');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete review');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-extrabold tracking-tight">Review Moderation</h1>
                    <p className="text-[#9ba7c9] mt-1">Audit customer comments, edit visual permissions, and maintain organic ratings.</p>
                </div>

                {/* Content list */}
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 w-full glass-card border border-[#aabcf5]/10 rounded-xl loading-shimmer" />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card border border-[#aabcf5]/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-white/5 border-b border-[#aabcf5]/10 text-xs text-[#9ba7c9] uppercase tracking-wider font-semibold">
                                        <th className="py-4 px-5">Product Jersey</th>
                                        <th className="py-4 px-5">Reviewer Name</th>
                                        <th className="py-4 px-5 text-center">Score Rating</th>
                                        <th className="py-4 px-5 w-96">Feedback Comment</th>
                                        <th className="py-4 px-5 text-center font-semibold">Status</th>
                                        <th className="py-4 px-5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#aabcf5]/5 text-[#d5ddff]">
                                    {reviews.length > 0 ? (
                                        reviews.map(r => {
                                            const id = r.id || r._id;
                                            const date = r.createdAt?.toDate
                                                ? r.createdAt.toDate().toLocaleDateString()
                                                : r.createdAt
                                                    ? new Date(r.createdAt).toLocaleDateString()
                                                    : '';
                                            return (
                                                <tr key={id} className="hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-5">
                                                        <span className="font-semibold text-white truncate max-w-[180px] block" title={r.productTitle}>
                                                            {r.productTitle || 'Jersey Item'}
                                                        </span>
                                                        <span className="text-[10px] text-[#9ba7c9] font-mono">{r.productId}</span>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="font-semibold text-[#d5ddff]">{r.userName || 'Anonymous'}</div>
                                                        <div className="text-[10px] text-[#9ba7c9] mt-0.5">{date}</div>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center justify-center gap-0.5 text-amber-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={13}
                                                                    fill={i < r.rating ? 'currentColor' : 'none'}
                                                                    className={i < r.rating ? 'text-amber-400' : 'text-white/10'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <p className="text-xs text-white leading-relaxed break-words line-clamp-2" title={r.comment}>
                                                            {r.comment || <span className="italic text-gray-500">No comment text left.</span>}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-5 text-center">
                                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${r.isHidden === true
                                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                                                            }`}>
                                                            {r.isHidden === true ? 'Hidden' : 'Visible'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleToggleHide(r)}
                                                                className={`p-2 rounded-lg transition ${r.isHidden === true
                                                                        ? 'text-indigo-400 hover:bg-indigo-500/10'
                                                                        : 'text-amber-400 hover:bg-amber-500/10'
                                                                    }`}
                                                                title={r.isHidden === true ? 'Make visible' : 'Block / Hide'}
                                                            >
                                                                {r.isHidden === true ? <Eye size={15} /> : <EyeOff size={15} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(id)}
                                                                className="p-2 text-rose-455 hover:bg-rose-500/10 text-rose-400 rounded-lg transition"
                                                                title="Delete review"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-8 text-[#9ba7c9]">
                                                <div className="flex flex-col items-center gap-1.5 py-4">
                                                    <MessageSquare size={32} className="text-[#aabcf5]/30" />
                                                    <p>No customer reviews received yet</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default AdminReviews;
