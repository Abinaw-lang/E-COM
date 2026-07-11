import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    Package,
    Layers,
    ShoppingCart,
    Users,
    Star,
    Ticket,
    Bell,
    Settings as SettingsIcon,
    LogOut,
    Sun,
    Moon,
    Search,
    Menu,
    X,
    User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
    { name: 'Dashboard', path: '/admin', icon: BarChart3 },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
];

const AdminLayout = ({ children, onSearch }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        // Check if body has dark class on mount
        const isDark = document.body.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        document.body.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchVal);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#090b12] text-[#f7f9ff] dark:bg-[#04060d] dark:text-[#ebeeff] font-sans selection:bg-primary selection:text-white transition-colors duration-200">

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[10%] w-[35rem] h-[35rem] bg-indigo-900/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-rose-950/10 rounded-full blur-[90px]" />
            </div>

            {/* SIDEBAR FOR DESKTOP */}
            <aside className="hidden lg:flex flex-col w-64 glass-card border-r border-[#aabcf5]/10 fixed top-0 bottom-0 left-0 z-30 transition-all duration-300">
                <div className="p-6 flex items-center justify-between border-b border-[#aabcf5]/10">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-display text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-rose-500 bg-clip-text text-transparent">
                            JERSEY ADMIN
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/10 border-l-4 border-blue-400 text-blue-300'
                                        : 'text-[#9ba7c9] hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-blue-400' : 'text-[#9ba7c9]'} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#aabcf5]/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 font-medium hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MOBILE SIDEBAR PANEL */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed top-0 bottom-0 left-0 w-64 bg-[#090b12] border-r border-[#aabcf5]/10 z-50 flex flex-col lg:hidden"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-[#aabcf5]/10">
                                <span className="font-display text-xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-rose-500 bg-clip-text text-transparent">
                                    JERSEY ADMIN
                                </span>
                                <button onClick={() => setIsMobileOpen(false)} className="text-[#9ba7c9] hover:text-white">
                                    <X size={22} />
                                </button>
                            </div>

                            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                                {sidebarItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                                    ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/10 border-l-4 border-blue-400 text-blue-300'
                                                    : 'text-[#9ba7c9] hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <Icon size={20} className={isActive ? 'text-blue-400' : 'text-[#9ba7c9]'} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-[#aabcf5]/10">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 font-medium hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN CONTAINER */}
            <div className="flex-1 flex flex-col lg:pl-64 z-10 w-full min-h-screen relative">

                {/* TOP NAVBAR */}
                <header className="h-20 glass-card border-b border-[#aabcf5]/10 flex items-center justify-between px-6 lg:px-8 w-full sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 text-[#9ba7c9] hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 bg-white/5 border border-[#aabcf5]/10 rounded-xl px-3.5 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
                            <Search size={18} className="text-[#9ba7c9]" />
                            <input
                                type="text"
                                placeholder="Global search..."
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm placeholder-[#9ba7c9] text-white w-48 focus:w-60 transition-all duration-300"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* DARK MODE */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-xl bg-white/5 border border-[#aabcf5]/10 text-[#9ba7c9] hover:text-white hover:bg-white/10 transition-all"
                            title="Toggle Theme"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* NOTIFICATIONS DROPDOWN */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2.5 rounded-xl bg-white/5 border border-[#aabcf5]/10 text-[#9ba7c9] hover:text-white hover:bg-white/10 transition-all relative"
                            >
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 15 }}
                                            className="absolute right-0 mt-3 w-80 glass-card border border-[#aabcf5]/15 rounded-2xl p-4 shadow-xl z-40"
                                        >
                                            <h4 className="font-display font-semibold text-sm border-b border-[#aabcf5]/10 pb-2 mb-2 flex justify-between items-center">
                                                <span>Notifications</span>
                                                <span className="text-xs text-blue-400 cursor-pointer hover:underline">Mark as read</span>
                                            </h4>
                                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                                <div className="p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition">
                                                    <p className="font-semibold text-white">System Update</p>
                                                    <p className="text-[#9ba7c9] mt-0.5">Admin Dashboard integrated successfully.</p>
                                                    <span className="text-[10px] text-blue-400/80 mt-1 block">Just now</span>
                                                </div>
                                                <div className="p-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition">
                                                    <p className="font-semibold text-white">New Order Received</p>
                                                    <p className="text-[#9ba7c9] mt-0.5">Order #J-94827 placed by abinaw227@gmail.com</p>
                                                    <span className="text-[10px] text-blue-400/80 mt-1 block">15 mins ago</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ADMIN PROFILE */}
                        <div className="flex items-center gap-3 border-l border-[#aabcf5]/10 pl-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10">
                                {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : <UserIcon size={18} />}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-semibold text-[#9ba7c9]">Administrator</p>
                                <p className="text-sm font-bold text-white truncate max-w-[120px]">{user?.displayName || user?.email || 'Admin'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-grow p-6 lg:p-8 w-full max-w-[1600px] mx-auto z-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
