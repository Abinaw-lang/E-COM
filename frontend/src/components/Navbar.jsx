import React, { useEffect, useState } from 'react';
import { Menu, X, ShoppingCart, Heart, User, LogOut, Moon, Sun, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useDarkMode } from '../hooks/useCustom';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const cartCount = cart?.products?.length || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-blue-200/20 bg-[#0a0f1d]/92 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="glass-card rounded-2xl px-4 py-3 flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold tracking-widest text-white">
            JERSEY <span className="text-primary">HUB</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-100/85 hover:text-primary transition">
              Home
            </Link>
            <Link to="/products" className="text-slate-100/85 hover:text-primary transition">
              Shop
            </Link>
            <Link to="/collections" className="text-slate-100/85 hover:text-primary transition">
              Collections
            </Link>
            <Link to="/custom-jersey" className="text-slate-100/85 hover:text-primary transition">
              Custom Jersey
            </Link>
            <Link to="/about" className="text-slate-100/85 hover:text-primary transition">
              About
            </Link>
            <Link to="/contact" className="text-slate-100/85 hover:text-primary transition">
              Contact
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition text-slate-100"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="hidden sm:flex p-2 rounded-full hover:bg-white/10 transition text-slate-100">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-white/10 rounded-full transition text-slate-100">
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/10 rounded-full transition text-slate-100"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="p-2 hover:bg-white/10 rounded-full transition text-slate-100">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-52 glass-card rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <Link to="/user-profile" className="block px-4 py-2 hover:bg-white/10">
                    Profile
                  </Link>
                  <Link to="/orders/history" className="block px-4 py-2 hover:bg-white/10">
                    Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-white/10">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-ripple rounded-lg bg-gradient-to-r from-primary to-accent text-slate-900 font-bold px-4 py-2 hover:shadow-neon transition">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-3">
            <Link to="/" className="block py-2 text-slate-100 hover:text-primary">
              Home
            </Link>
            <Link to="/products" className="block py-2 text-slate-100 hover:text-primary">
              Shop
            </Link>
            <Link to="/collections" className="block py-2 text-slate-100 hover:text-primary">
              Collections
            </Link>
            <Link to="/custom-jersey" className="block py-2 text-slate-100 hover:text-primary">
              Custom Jersey
            </Link>
            {user ? (
              <>
                <Link to="/user-profile" className="block py-2 text-slate-100 hover:text-primary">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-slate-100 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-slate-100 hover:text-primary">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
