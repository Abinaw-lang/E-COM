import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Eye,
    Printer,
    X,
    ShoppingCart,
    Mail,
    Phone,
    MapPin,
    Truck,
    DollarSign,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { orderService } from '../services';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewOrder, setViewOrder] = useState(null);

    // Status updates
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await orderService.getAllOrders();
            setOrders(res.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = (order) => {
        setViewOrder(order);
        setOrderStatus(order.orderStatus || 'pending');
        setTrackingNumber(order.trackingNumber || '');
    };

    const handleSaveStatus = async (e) => {
        e.preventDefault();
        if (!viewOrder) return;
        const orderId = viewOrder.id || viewOrder._id;

        try {
            setUpdatingStatus(true);
            await orderService.updateOrderStatus(orderId, { orderStatus, trackingNumber });

            // Update local state
            setOrders(prev => prev.map(o => {
                if ((o.id || o._id) === orderId) {
                    return { ...o, orderStatus, trackingNumber };
                }
                return o;
            }));

            setViewOrder(prev => ({ ...prev, orderStatus, trackingNumber }));
            toast.success('Order status updated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Zero-dependency HTML-to-PDF/Print Generation
    const handlePrintInvoice = (order) => {
        const formattedDate = order.createdAt?.toDate
            ? order.createdAt.toDate().toLocaleDateString()
            : new Date(order.createdAt).toLocaleDateString();

        const itemsHtml = order.products?.map((item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 6px; font-weight: bold;">${idx + 1}</td>
        <td style="padding: 12px 6px;">
          <div style="font-weight: 700; color: #1e293b;">${item.title || 'Special Edit Jersey'}</div>
          <div style="font-size: 11px; color: #64748b;">
            SKU: ${item.sku || 'N/A'} | Size: ${item.size || 'M'} | Color: ${item.color || 'Default'}
          </div>
        </td>
        <td style="padding: 12px 6px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 6px; text-align: right;">₹${item.price}</td>
        <td style="padding: 12px 6px; text-align: right; font-weight: 700;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('') || '';

        const shipping = order.shippingAddress || {};
        const subtotal = order.totalAmount - (order.shippingCharges || 0);

        const invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id || order._id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; padding: 40px; margin: 0; line-height: 1.5; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 26px; font-weight: 900; color: #1e3a8a; }
            .invoice-label { font-size: 24px; font-weight: 700; text-align: right; color: #475569; }
            .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 30px; margin-bottom: 35px; }
            .meta-box h4 { font-size: 14px; text-transform: uppercase; color: #64748b; margin: 0 0 10px 0; border-bottom: 1px dashed #cbd5e1; padding-bottom: 5px; }
            .meta-box p { margin: 3px 0; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px; }
            th { background-color: #f8fafc; padding: 10px 6px; font-size: 11px; text-transform: uppercase; color: #475569; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; }
            .totals-table { width: 320px; float: right; margin-top: 10px; }
            .totals-table td { padding: 6px; font-size: 13px; }
            .totals-table tr.grand { font-size: 16px; font-weight: 800; border-top: 2px solid #1e3a8a; color: #1e3a8a; }
            .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #94a3b8; border-t: 1px solid #e2e8f0; padding-top: 20px; clear: both; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <div class="logo">JERSEY STORE</div>
                <p style="font-size: 11px; color: #64748b; margin: 5px 0 0 0;">Premium High-Quality Sports Gear</p>
              </div>
              <div class="invoice-label">
                INVOICE
                <p style="font-size: 12px; font-weight: normal; margin: 5px 0 0 0;">Date: ${formattedDate}</p>
                <p style="font-size: 11px; font-weight: normal; font-family: monospace; color: #ef4444; margin: 2px 0 0 0;">ID: #${(order.id || order._id).toUpperCase()}</p>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-box">
                <h4>Billing / Shipping To:</h4>
                <p><strong>${shipping.name || 'Valued Customer'}</strong></p>
                <p>${shipping.addressLine1 || shipping.address || ''}</p>
                <p>${shipping.city || ''}, ${shipping.state || ''} - ${shipping.postalCode || ''}</p>
                <p>Email: ${shipping.email || 'N/A'}</p>
                <p>Phone: ${shipping.phone || 'N/A'}</p>
              </div>
              <div class="meta-box">
                <h4>Payment & Logistics:</h4>
                <p>Payment Mode: <strong>${order.paymentMethod?.toUpperCase() || 'RAZORPAY'}</strong></p>
                <p>Payment ID: <span style="font-family: monospace; font-size: 12px;">${order.paymentId || 'completed'}</span></p>
                <p>Payment Status: <span style="color: green; font-weight: bold;">${order.paymentStatus?.toUpperCase() || 'COMPLETED'}</span></p>
                <p>Fulfillment Status: <strong>${order.orderStatus?.toUpperCase() || 'PENDING'}</strong></p>
                ${order.trackingNumber ? `<p>Waybill / Tracking: <span style="font-family: monospace;">${order.trackingNumber}</span></p>` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 40px;">#</th>
                  <th style="text-align: left;">Item Description</th>
                  <th style="width: 80px; text-align: center;">Qty</th>
                  <th style="width: 110px; text-align: right;">Unit Price</th>
                  <th style="width: 120px; text-align: right;">Overall</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <table class="totals-table">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right; font-weight: 600;">₹${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Delivery Charges:</td>
                <td style="text-align: right; font-weight: 600;">₹${order.shippingCharges || 0}</td>
              </tr>
              <tr class="grand">
                <td>Paid Total:</td>
                <td style="text-align: right; font-weight: 800;">₹${order.totalAmount.toLocaleString()}</td>
              </tr>
            </table>

            <div class="footer">
              <p>Thank you for shopping with Jersey Store! For disputes, contact billing@jerseystore.com.</p>
              <p>© ${new Date().getFullYear()} Jersey Store. All rights reserved.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
        invoiceWindow.document.close();
    };

    // Filter orders
    const filteredOrders = orders.filter(o => {
        const id = o.id || o._id || '';
        const email = o.shippingAddress?.email || o.userId || '';
        const matchSearch = id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' ? true : o.orderStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-extrabold tracking-tight">Order Fulfilment</h1>
                    <p className="text-[#9ba7c9] mt-1">Track payments, shipping designations, and trigger customer receipts.</p>
                </div>

                {/* Searching & Filter utilities */}
                <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                        <Search className="absolute left-3.5 top-3.5 text-[#9ba7c9]" size={16} />
                        <input
                            type="text"
                            placeholder="Search Order ID, Customer Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-[#aabcf5]/10 rounded-xl placeholder-[#9ba7c9] text-white text-sm focus:border-blue-500 focus:outline-none transition animate-pulse-glow"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${statusFilter === status
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/10'
                                        : 'bg-[#121827] border-[#aabcf5]/10 text-[#9ba7c9] hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Table */}
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
                                        <th className="py-4 px-5">Order ID</th>
                                        <th className="py-4 px-5">Customer Email</th>
                                        <th className="py-4 px-5">Date</th>
                                        <th className="py-4 px-5 text-right">Paid Total</th>
                                        <th className="py-4 px-5 text-center">Payment Status</th>
                                        <th className="py-4 px-5 text-center">Delivery Status</th>
                                        <th className="py-4 px-5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#aabcf5]/5 text-sm text-[#d5ddff]">
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map(o => {
                                            const id = o.id || o._id;
                                            const date = o.createdAt?.toDate
                                                ? o.createdAt.toDate().toLocaleDateString()
                                                : new Date(o.createdAt).toLocaleDateString();
                                            return (
                                                <tr key={id} className="hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-5 font-mono text-xs text-white">#{id.toUpperCase()}</td>
                                                    <td className="py-4 px-5 truncate max-w-[200px]" title={o.shippingAddress?.email || o.userId}>
                                                        {o.shippingAddress?.email || o.userId || 'Guest Client'}
                                                    </td>
                                                    <td className="py-4 px-5">{date}</td>
                                                    <td className="py-4 px-5 text-right font-display font-semibold text-white">₹{o.totalAmount.toLocaleString()}</td>
                                                    <td className="py-4 px-5 text-center">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${o.paymentStatus === 'completed'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            }`}>
                                                            {o.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 text-center">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${o.orderStatus === 'delivered'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : o.orderStatus === 'shipped'
                                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                                    : o.orderStatus === 'cancelled'
                                                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            }`}>
                                                            {o.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleOpenDetails(o)}
                                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                                                                title="Open order settings"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handlePrintInvoice(o)}
                                                                className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                                                                title="Print Invoice PDF"
                                                            >
                                                                <Printer size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-8 text-[#9ba7c9]">
                                                No orders match your filter critera.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ORDER DETAILS & STATUS UPDATE DIALOG */}
                <AnimatePresence>
                    {viewOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setViewOrder(null)}
                                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card border border-[#aabcf5]/15 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl relative"
                            >

                                {/* Header */}
                                <div className="p-6 border-b border-[#aabcf5]/10 flex justify-between items-center bg-[#090b12]">
                                    <div>
                                        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                            <ShoppingCart size={20} className="text-blue-400" />
                                            <span>Fufilment details - #{viewOrder.id ? viewOrder.id.slice(-8).toUpperCase() : viewOrder._id.slice(-8).toUpperCase()}</span>
                                        </h3>
                                        <p className="text-xs text-[#9ba7c9] mt-0.5">Payment Ref: {viewOrder.paymentId || 'N/A'}</p>
                                    </div>
                                    <button onClick={() => setViewOrder(null)} className="text-[#9ba7c9] hover:text-white p-1 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">

                                    {/* Status & tracking update form */}
                                    <form onSubmit={handleSaveStatus} className="bg-white/5 border border-white/5 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Order Status</label>
                                            <select
                                                value={orderStatus}
                                                onChange={(e) => setOrderStatus(e.target.value)}
                                                className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[#9ba7c9] uppercase tracking-wider block mb-2">Waybill / Tracking No.</label>
                                            <input
                                                type="text"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="e.g. AWB94002932"
                                                className="w-full bg-[#121827] border border-[#aabcf5]/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={updatingStatus}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition text-xs"
                                        >
                                            {updatingStatus ? 'Saving...' : 'Update Fulfillment'}
                                        </button>
                                    </form>

                                    {/* Customer and Logistics split */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                                        {/* Shipping Address */}
                                        <div className="bg-[#121827]/40 border border-[#aabcf5]/5 rounded-2xl p-5 space-y-3">
                                            <h4 className="text-xs font-bold text-[#9ba7c9] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#aabcf5]/5 pb-2">
                                                <MapPin size={14} className="text-indigo-400" />
                                                <span>Logistics Address</span>
                                            </h4>
                                            <div className="space-y-2 text-xs text-[#d5ddff]">
                                                <p className="font-semibold text-white text-sm">{viewOrder.shippingAddress?.name || 'Customer'}</p>
                                                <p>{viewOrder.shippingAddress?.addressLine1 || viewOrder.shippingAddress?.address}</p>
                                                <p>{viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.state} - {viewOrder.shippingAddress?.postalCode}</p>

                                                <div className="pt-2 flex flex-col gap-1.5 border-t border-[#aabcf5]/5 mt-2">
                                                    <p className="flex items-center gap-1.5">
                                                        <Mail size={12} className="text-[#9ba7c9]" />
                                                        <span>{viewOrder.shippingAddress?.email || 'No email'}</span>
                                                    </p>
                                                    <p className="flex items-center gap-1.5">
                                                        <Phone size={12} className="text-[#9ba7c9]" />
                                                        <span>{viewOrder.shippingAddress?.phone || 'No phone'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing details */}
                                        <div className="bg-[#121827]/40 border border-[#aabcf5]/5 rounded-2xl p-5 space-y-3">
                                            <h4 className="text-xs font-bold text-[#9ba7c9] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#aabcf5]/5 pb-2">
                                                <DollarSign size={14} className="text-emerald-400" />
                                                <span>Fulfillment Statement</span>
                                            </h4>
                                            <div className="space-y-2.5 text-xs text-[#d5ddff]">
                                                <div className="flex justify-between">
                                                    <span className="text-[#9ba7c9]">Payment mode:</span>
                                                    <span className="font-semibold uppercase text-white">{viewOrder.paymentMethod || 'Razorpay'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[#9ba7c9]">Delivery Charges:</span>
                                                    <span className="font-semibold text-white">₹{viewOrder.shippingCharges || 0}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-[#aabcf5]/5 pt-2 text-[#9ba7c9]">
                                                    <span>Invoice Total:</span>
                                                    <span className="font-bold text-white text-sm font-display">₹{viewOrder.totalAmount.toLocaleString()}</span>
                                                </div>

                                                <div className="mt-2.5 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-2">
                                                    <AlertCircle size={14} className="text-orange-400 shrink-0 mt-0.5" />
                                                    <p className="text-[10px] text-orange-400/80 leading-normal">
                                                        Updating status automatically notifies customer email for shipped, delivered, or cancelled items.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Order Products List */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#9ba7c9] uppercase tracking-wider mb-3">Itemized Catalog</h4>
                                        <div className="border border-[#aabcf5]/10 rounded-xl overflow-hidden">
                                            <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                    <tr className="bg-white/5 border-b border-[#aabcf5]/10 text-xs text-[#9ba7c9] uppercase font-semibold">
                                                        <th className="py-3 px-4">Product</th>
                                                        <th className="py-3 px-4 text-center">Specs</th>
                                                        <th className="py-3 px-4 text-center">Quantity</th>
                                                        <th className="py-3 px-4 text-right">Price</th>
                                                        <th className="py-3 px-4 text-right font-semibold">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#aabcf5]/5 text-[#d5ddff]">
                                                    {viewOrder.products?.map((p, idx) => (
                                                        <tr key={idx} className="hover:bg-white/5 transition">
                                                            <td className="py-3 px-4 font-semibold text-white">{p.title || 'Jersey Catalog Product'}</td>
                                                            <td className="py-3 px-4 text-center">
                                                                <span className="inline-block bg-[#121827] border border-white/5 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                                                                    Size {p.size || 'M'} | {p.color || 'Def'}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 text-center font-bold">{p.quantity}</td>
                                                            <td className="py-3 px-4 text-right">₹{p.price}</td>
                                                            <td className="py-3 px-4 text-right font-semibold text-white">₹{p.price * p.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>

                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
