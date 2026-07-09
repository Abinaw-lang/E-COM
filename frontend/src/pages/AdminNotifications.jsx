import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bell,
    Users,
    Volume2,
    AlertCircle,
    FileText
} from 'lucide-react';
import { adminService } from '../services';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await adminService.getNotifications();
            setNotifications(res.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load notification history logs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error('Please fill in both title and message body');
            return;
        }

        try {
            setSending(true);
            const res = await adminService.sendNotification({
                title: title.trim(),
                message: message.trim(),
                targetAudience
            });

            toast.success('Broadcast notification dispatched successfully!');

            // Clear form
            setTitle('');
            setMessage('');
            setTargetAudience('all');

            // Refresh listing
            fetchNotifications();
        } catch (err) {
            console.error(err);
            toast.error('Failed to dispatch notification');
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-extrabold tracking-tight">System Announcements</h1>
                    <p className="text-[#9ba7c9] mt-1">Broadcast store-wide updates, holiday alerts, or custom discount campaigns.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COMPOSER FORM CARD */}
                    <div className="lg:col-span-1">
                        <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 space-y-6 sticky top-24">
                            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2 border-b border-[#aabcf5]/10 pb-4">
                                <Volume2 size={20} className="text-blue-400" />
                                <span>Composer Terminal</span>
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Announcement Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Winter Clearance Launch!"
                                        className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-505 focus:border-blue-500 focus:outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Audience Scope</label>
                                    <select
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                                    >
                                        <option value="all">All Visitors & Account Holders</option>
                                        <option value="customers">Customers (Previous Purchasers)</option>
                                        <option value="newsletter">Subscriber List Only</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Message Body *</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Enter short description or coupon instructions..."
                                        className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-505 focus:border-blue-500 focus:outline-none transition font-sans"
                                        rows="5"
                                        required
                                    />
                                </div>

                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex gap-2 items-start text-[11px] text-[#9ba7c9] leading-relaxed">
                                    <AlertCircle size={15} className="text-blue-400 shrink-0 mt-0.5" />
                                    <p>
                                        Sending this broadcast writes a dynamic header notification that is pushed to all visiting user sessions relative to their account status filter.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                                >
                                    <Send size={15} />
                                    <span>{sending ? 'Dispatching Broadcast...' : 'Publish Announcement'}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* HISTORICAL LOG CARD */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6">
                            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2 border-b border-[#aabcf5]/10 pb-4 mb-4">
                                <FileText size={20} className="text-indigo-400" />
                                <span>Historical Dispatch System</span>
                            </h3>

                            {loading ? (
                                <div className="flex flex-col gap-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-16 w-full glass-card border border-[#aabcf5]/10 rounded-xl loading-shimmer" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((n) => {
                                        const id = n.id || n._id;
                                        const date = n.createdAt?.toDate
                                            ? n.createdAt.toDate().toLocaleString()
                                            : n.createdAt
                                                ? new Date(n.createdAt).toLocaleString()
                                                : 'Just now';
                                        return (
                                            <motion.div
                                                key={id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 bg-white/5 border border-white/5 hover:border-[#aabcf5]/15 rounded-2xl transition space-y-2 flex flex-col justify-between"
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex gap-3">
                                                        <div className="p-2 h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                                                            <Bell size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white leading-normal">{n.title}</h4>
                                                            <p className="text-xs text-[#9ba7c9] mt-1 pr-6 leading-relaxed font-sans">{n.message}</p>
                                                        </div>
                                                    </div>

                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10 uppercase tracking-wider shrink-0 capitalize">
                                                        Target: {n.targetAudience || 'all'}
                                                    </span>
                                                </div>

                                                <div className="pt-2 border-t border-[#aabcf5]/5 flex items-center justify-between text-[10px] text-[#9ba7c9]">
                                                    <span>Ref: #{id.toUpperCase()}</span>
                                                    <span>{date}</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {notifications.length === 0 && (
                                        <div className="text-center py-10 text-[#9ba7c9] flex flex-col items-center gap-2">
                                            <Volume2 size={36} className="text-[#aabcf5]/20" />
                                            <p className="text-sm font-semibold">No recent broadcasts recorded</p>
                                            <p className="text-xs text-[#9ba7c9]/80">Compose and dispatch announcements using the composer panel to register notification logs.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminNotifications;
