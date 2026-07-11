import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    UserX,
    UserCheck,
    Mail,
    MapPin,
    Phone,
    X,
    Eye,
    ShoppingBag,
    Clock
} from 'lucide-react';
import { userService, orderService } from '../services';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userRes = await userService.getAllUsers();
            setCustomers(userRes.data?.data || []);

            const orderRes = await orderService.getAllOrders();
            setOrders(orderRes.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load customers catalog');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (cust) => {
        const id = cust.id || cust._id;
        const currentIsActive = cust.isActive !== false;
        const action = currentIsActive ? 'block' : 'activate';

        if (window.confirm(`Are you sure you want to ${action} user "${cust.name || cust.email}"?`)) {
            try {
                await userService.toggleUserActive(id);
                setCustomers(prev => prev.map(c => {
                    if ((c.id || c._id) === id) {
                        return { ...c, isActive: !currentIsActive };
                    }
                    return c;
                }));

                if (selectedCustomer && (selectedCustomer.id || selectedCustomer._id) === id) {
                    setSelectedCustomer(prev => ({ ...prev, isActive: !currentIsActive }));
                }

                toast.success(`User successfully ${currentIsActive ? 'blocked' : 'activated'}`);
            } catch (err) {
                console.error(err);
                toast.error('Failed to update active status');
            }
        }
    };

    const handleViewCustomerDetails = (customer) => {
        const cId = customer.id || customer._id;
        const matchOrders = orders.filter(o => o.userId === cId);
        setCustomerOrders(matchOrders);
        setSelectedCustomer(customer);
    };

    // filter query
    const filteredCustomers = customers.filter(c => {
        const name = (c.name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getCustomerMetrics = (cId) => {
        const cOrders = orders.filter(o => o.userId === cId);
        const completedOrders = cOrders.filter(o => o.paymentStatus === 'completed' || o.orderStatus === 'delivered');
        const totalSpend = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return {
            orderCount: cOrders.length,
            spend: totalSpend
        };
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-extrabold tracking-tight">Customers Directory</h1>
                    <p className="text-[#9ba7c9] mt-1">Review accounts, lock profiles, and audit client lifetime orders value.</p>
                </div>

                {/* Searching bar */}
                <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-5 flex items-center gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3.5 top-3.5 text-[#9ba7c9]" size={16} />
                        <input
                            type="text"
                            placeholder="Search user profiles by name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-[#aabcf5]/10 rounded-xl placeholder-[#9ba7c9] text-white text-sm focus:border-blue-500 focus:outline-none transition"
                        />
                    </div>
                </div>

                {/* Catalog list */}
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 w-full glass-card border border-[#aabcf5]/10 rounded-xl loading-shimmer" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Table roster */}
                        <div className="lg:col-span-2 glass-card border border-[#aabcf5]/10 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-[#aabcf5]/10 text-xs text-[#9ba7c9] uppercase tracking-wider font-semibold">
                                            <th className="py-4 px-5">Name & Email</th>
                                            <th className="py-4 px-5 text-center">Orders Placed</th>
                                            <th className="py-4 px-5 text-right flex-grow">Total Spend</th>
                                            <th className="py-4 px-5 text-center">Security status</th>
                                            <th className="py-4 px-5 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#aabcf5]/5 text-[#d5ddff]">
                                        {filteredCustomers.length > 0 ? (
                                            filteredCustomers.map(c => {
                                                const id = c.id || c._id;
                                                const metrics = getCustomerMetrics(id);
                                                const isActive = c.isActive !== false;
                                                return (
                                                    <tr key={id} className="hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-5">
                                                            <div className="font-semibold text-white">{c.name || 'Anonymous User'}</div>
                                                            <div className="text-xs text-[#9ba7c9] mt-0.5">{c.email}</div>
                                                        </td>
                                                        <td className="py-4 px-5 text-center font-bold">{metrics.orderCount}</td>
                                                        <td className="py-4 px-5 text-right font-display font-semibold text-white">₹{metrics.spend.toLocaleString()}</td>
                                                        <td className="py-4 px-5 text-center">
                                                            <span className={`inline-flex px-2 px-0.5 rounded text-xs font-semibold ${isActive
                                                                    ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/20'
                                                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                }`}>
                                                                {isActive ? 'Active' : 'Locked'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-5 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <button
                                                                    onClick={() => handleViewCustomerDetails(c)}
                                                                    className="p-1 px-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 rounded-lg flex items-center gap-1 transition"
                                                                    title="View orders history"
                                                                >
                                                                    <Eye size={14} />
                                                                    <span>Audit</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleToggleActive(c)}
                                                                    className={`p-1.5 rounded-lg transition ${isActive
                                                                            ? 'text-rose-450 hover:bg-rose-500/10 text-rose-400'
                                                                            : 'text-indigo-400 hover:bg-indigo-500/10 text-[#67e8f9]'
                                                                        }`}
                                                                    title={isActive ? 'Block Customer' : 'Activate Customer'}
                                                                >
                                                                    {isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-6 text-[#9ba7c9]">
                                                    No client profiles match search query.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sidebar drawer showing selected customer profile and order history */}
                        <div className="lg:col-span-1">
                            {selectedCustomer ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass-card border border-[#aabcf5]/15 rounded-2xl p-6 space-y-6 sticky top-24"
                                >
                                    <div className="flex justify-between items-start border-b border-[#aabcf5]/10 pb-4">
                                        <div>
                                            <h3 className="text-xl font-display font-bold text-white leading-normal">
                                                {selectedCustomer.name || 'Anonymous User'}
                                            </h3>
                                            <p className="text-xs text-[#9ba7c9] mt-0.5">Role: Member</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCustomer(null)}
                                            className="text-[#9ba7c9] hover:text-white p-1 hover:bg-white/5 rounded-lg"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Profile Cards */}
                                    <div className="space-y-3.5 text-xs text-[#d5ddff]">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-[#9ba7c9]" />
                                            <span>{selectedCustomer.email}</span>
                                        </div>
                                        {selectedCustomer.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-[#9ba7c9]" />
                                                <span>{selectedCustomer.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-[#9ba7c9]" />
                                            <span>
                                                Created:{' '}
                                                {selectedCustomer.createdAt?.toDate
                                                    ? selectedCustomer.createdAt.toDate().toLocaleDateString()
                                                    : selectedCustomer.createdAt
                                                        ? new Date(selectedCustomer.createdAt).toLocaleDateString()
                                                        : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-[#aabcf5]/5 flex gap-2">
                                            <button
                                                onClick={() => handleToggleActive(selectedCustomer)}
                                                className={`flex-1 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border transition ${selectedCustomer.isActive !== false
                                                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-450 hover:bg-rose-500/20 text-rose-400'
                                                        : 'bg-emerald-500/10 border-emerald-500/20 text-[#10b981] hover:bg-emerald-500/25'
                                                    }`}
                                            >
                                                {selectedCustomer.isActive !== false ? (
                                                    <>
                                                        <UserX size={14} />
                                                        <span>Block User</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck size={14} />
                                                        <span>Unlock User</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Checkout Orders history lists */}
                                    <div className="space-y-3 border-t border-[#aabcf5]/10 pt-5">
                                        <h4 className="text-xs font-bold text-[#9ba7c9] uppercase tracking-wider flex items-center gap-1">
                                            <ShoppingBag size={13} />
                                            <span>Transaction History ({customerOrders.length})</span>
                                        </h4>

                                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                                            {customerOrders.length > 0 ? (
                                                customerOrders.map(o => {
                                                    const id = o.id || o._id;
                                                    const date = o.createdAt?.toDate
                                                        ? o.createdAt.toDate().toLocaleDateString()
                                                        : new Date(o.createdAt).toLocaleDateString();
                                                    return (
                                                        <div
                                                            key={id}
                                                            className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-xs text-white"
                                                        >
                                                            <div>
                                                                <p className="font-semibold font-mono">#{id.slice(-6).toUpperCase()}</p>
                                                                <p className="text-[#9ba7c9] text-[10px] mt-0.5">{date}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold font-display">₹{o.totalAmount.toLocaleString()}</p>
                                                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold capitalize mt-0.5 ${o.orderStatus === 'delivered'
                                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                                                        : o.orderStatus === 'cancelled'
                                                                            ? 'bg-rose-500/15 text-rose-450'
                                                                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                                                    }`}>
                                                                    {o.orderStatus}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-xs text-[#9ba7c9] italic py-2">No orders recorded for this customer yet.</p>
                                            )}
                                        </div>
                                    </div>

                                </motion.div>
                            ) : (
                                <div className="glass-card border border-[#aabcf5]/10 border-dashed rounded-2xl p-8 text-center text-[#9ba7c9] h-full flex flex-col items-center justify-center gap-2">
                                    <ShoppingBag size={32} className="text-[#aabcf5]/30" />
                                    <p className="text-sm font-semibold">Audit Panel</p>
                                    <p className="text-xs text-[#9ba7c9]/80">Select a customer profile to view contact logs and complete purchase orders audit.</p>
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default AdminCustomers;
