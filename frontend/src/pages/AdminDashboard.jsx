import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { orderService, productService } from '../services';
import MainLayout from '../layouts/MainLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const ordersRes = await orderService.getAllOrders();
        const productsRes = await productService.getProducts();
        
        const orders = ordersRes.data.data;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: productsRes.data.count || 0,
          totalUsers: 0 // Would come from admin user endpoint
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className={`opacity-20`} />
      </div>
    </motion.div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={ShoppingCart}
                  label="Total Orders"
                  value={stats.totalOrders}
                  color="border-l-4 border-blue-500"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Total Revenue"
                  value={`₹${stats.totalRevenue.toLocaleString()}`}
                  color="border-l-4 border-green-500"
                />
                <StatCard
                  icon={Package}
                  label="Total Products"
                  value={stats.totalProducts}
                  color="border-l-4 border-purple-500"
                />
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.totalUsers}
                  color="border-l-4 border-orange-500"
                />
              </div>

              {/* Quick Action Buttons */}
              <div className="grid md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/admin/products')}
                  className="bg-blue-500 text-white p-6 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Manage Products
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/admin/orders')}
                  className="bg-green-500 text-white p-6 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  Manage Orders
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/admin/users')}
                  className="bg-purple-500 text-white p-6 rounded-lg font-semibold hover:bg-purple-600 transition"
                >
                  Manage Users
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/admin/coupons')}
                  className="bg-orange-500 text-white p-6 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Manage Coupons
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
