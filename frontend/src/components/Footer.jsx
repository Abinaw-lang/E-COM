import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#070a13] text-white py-14 overflow-hidden">
      <div className="absolute inset-0 sports-particles opacity-20" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-card rounded-3xl p-8 grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-4">JERSEY HUB</h3>
            <p className="text-slate-300/80">Premium football and sports jerseys with elite quality, futuristic style, and fan-first customization.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300/80">
              <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition">Shop</Link></li>
              <li><Link to="/collections" className="hover:text-primary transition">Collections</Link></li>
              <li><Link to="/custom-jersey" className="hover:text-primary transition">Custom Jersey</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-slate-300/80">
              <li><a href="#" className="hover:text-primary transition">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button className="btn-ripple rounded-lg bg-primary text-slate-900 font-bold px-4">
                Join
              </button>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-slate-300/80 hover:text-primary transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-slate-300/80 hover:text-primary transition">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-slate-300/80 hover:text-primary transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-slate-300/80 hover:text-primary transition">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white/10 mb-8" />

        <div className="text-center text-slate-400">
          <p>&copy; 2026 Jersey Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
