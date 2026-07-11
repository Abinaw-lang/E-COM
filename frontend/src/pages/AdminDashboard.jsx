import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { adminService } from '../services';
import AdminLayout from '../layouts/AdminLayout';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStats();
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Revenue',
      value: stats ? `₹${stats.revenue.toLocaleString()}` : '₹0',
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Total completed sales'
    },
    {
      title: 'Total Orders',
      value: stats ? stats.totalOrders : '0',
      icon: ShoppingCart,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      description: 'All time placements'
    },
    {
      title: 'Active Customers',
      value: stats ? stats.totalCustomers : '0',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      description: 'Registered accounts'
    },
    {
      title: 'Total Products',
      value: stats ? stats.totalProducts : '0',
      icon: Package,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Catalog items'
    },
    {
      title: 'Pending Orders',
      value: stats ? stats.pendingOrders : '0',
      icon: Clock,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description: 'Awaiting fulfillment'
    },
    {
      title: 'Low Stock warnings',
      value: stats ? stats.lowStockCount : '0',
      icon: AlertTriangle,
      color: stats?.lowStockCount > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      description: 'Items <= 5 units left'
    }
  ];

  // SVG Chart component
  const SalesChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxSales = Math.max(...data.map(d => d.sales), 5000);
    const height = 240;
    const width = 500;
    const padding = 45;

    // generate points string for SVG polyline
    const pointsStr = data.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const ratio = d.sales / maxSales;
      const y = height - padding - ratio * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    const pointsArr = data.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const ratio = d.sales / maxSales;
      const y = height - padding - ratio * (height - padding * 2);
      return { x, y, val: d.sales, label: d.month };
    });

    return (
      <div className="w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full select-none">
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6fc2ff" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#ef3340" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const y = height - padding - r * (height - padding * 2);
            const val = Math.round(maxSales * r);
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(170, 188, 245, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  fill="#9ba7c9"
                  fontSize="9px"
                  textAnchor="end"
                >
                  ₹{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <polygon
            points={`${padding},${height - padding} ${pointsStr} ${width - padding},${height - padding}`}
            fill="url(#gradient)"
          />

          {/* Spark Line */}
          <polyline
            points={pointsStr}
            fill="none"
            stroke="url(#lineGlow)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {pointsArr.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-6 transition-all"
                title={`${pt.label}: ₹${pt.val}`}
              />
              <text
                x={pt.x}
                y={height - padding + 16}
                fill="#9ba7c9"
                fontSize="10px"
                textAnchor="middle"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in-up">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Dashboard Overview</h1>
            <p className="text-[#9ba7c9] mt-1">Real-time jersey shop analytics and orders activity.</p>
          </div>
          <button
            onClick={fetchStats}
            className="self-start sm:self-auto bg-white/5 hover:bg-white/10 border border-[#aabcf5]/15 transition px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            Refresh Metrics
          </button>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 space-y-4">
                  <div className="h-4 w-2/3 rounded loading-shimmer" />
                  <div className="h-8 w-1/2 rounded loading-shimmer" />
                  <div className="h-3 w-3/4 rounded loading-shimmer" />
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card border border-[#aabcf5]/10 rounded-2xl p-6 h-80 loading-shimmer" />
              <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 h-80 loading-shimmer" />
            </div>
          </>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {dashboardCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    whileHover={{ y: -4 }}
                    className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#9ba7c9] text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                      <div className={`p-2 rounded-xl border ${card.color}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold font-display tracking-tight text-white">{card.value}</h3>
                      <p className="text-[11px] text-[#9ba7c9]/80 mt-1">{card.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sales Chart & Low Stock warnings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Sales Chart */}
              <div className="lg:col-span-2 glass-card border border-[#aabcf5]/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold font-display text-white">Monthly Sales Revenue</h3>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      <TrendingUp size={14} />
                      <span>Live Data</span>
                    </div>
                  </div>
                  {stats?.chartData && stats.chartData.length > 0 ? (
                    <SalesChart data={stats.chartData} />
                  ) : (
                    <div className="h-60 flex items-center justify-center text-[#9ba7c9] text-sm">
                      No sales data available.
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Warn Warnings */}
              <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 border-b border-[#aabcf5]/10 pb-3">
                  <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    <span>Low Stock Alerts</span>
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {stats?.lowStockCount || 0} Products
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-60">
                  {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                    stats.lowStockProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => navigate('/admin/products')}
                        className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 hover:border-blue-500/30 transition cursor-pointer"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-sm font-semibold truncate text-white">{p.title}</p>
                          <p className="text-xs text-[#9ba7c9]">Price: ₹{p.price}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${p.stock === 0
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                            {p.stock} left
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#9ba7c9] text-sm">
                      All products have optimal stock levels.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="glass-card border border-[#aabcf5]/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#aabcf5]/5">
                <h3 className="text-lg font-bold font-display text-white">Recent Orders Activity</h3>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition"
                >
                  <span>View All Orders</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#aabcf5]/10 text-xs text-[#9ba7c9] uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer Email</th>
                      <th className="py-3.5 px-4 text-center">Items</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-center">Payment Status</th>
                      <th className="py-3.5 px-4 text-center">Order Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#aabcf5]/5 text-sm">
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map(o => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-white">#{o.id ? o.id.slice(-8).toUpperCase() : o._id.slice(-8).toUpperCase()}</td>
                          <td className="py-4 px-4">{o.userId === stats?.adminId ? 'Guest Admin' : (o.shippingAddress?.email || o.userId || 'Guest Client')}</td>
                          <td className="py-4 px-4 text-center font-semibold">{o.products?.reduce((sum, p) => sum + p.quantity, 0) || 0}</td>
                          <td className="py-4 px-4 text-right font-display font-semibold text-white">₹{o.totalAmount.toLocaleString()}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${o.paymentStatus === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : o.paymentStatus === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
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
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => navigate(`/admin/orders`)}
                              className="text-xs text-blue-400 hover:underline hover:text-blue-300 font-semibold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-[#9ba7c9]">
                          No orders found matching this profile yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
