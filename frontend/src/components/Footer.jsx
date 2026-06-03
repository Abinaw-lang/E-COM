import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">EStore</h3>
            <p className="text-gray-400">Your one-stop shop for everything you need. Quality products at unbeatable prices.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-primary transition">Home</a></li>
              <li><a href="/products" className="hover:text-primary transition">Products</a></li>
              <li><a href="/about" className="hover:text-primary transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary transition">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        <div className="text-center text-gray-400">
          <p>&copy; 2024 EStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
