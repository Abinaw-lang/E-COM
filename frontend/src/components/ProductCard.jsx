import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onCompare }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    try {
      await addToWishlist(product._id);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const productSizes = product.sizes || ['S', 'M', 'L'];

  return (
    <motion.div
      onClick={() => navigate(`/products/${product._id}`)}
      whileHover={{ y: -10, rotateX: 1.4, rotateY: -1.4 }}
      transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      className="glass-card gradient-border rounded-2xl cursor-pointer overflow-hidden border border-white/10"
    >
      <div className="relative overflow-hidden bg-slate-800 h-64">
        <img
          src={product.images[0]?.url || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/85 to-transparent" />
        <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-secondary/20">
          {discountPercent > 0 ? `-${discountPercent}%` : 'New'}
        </div>
        <div className="absolute top-3 left-3 premium-chip text-xs">{product.brand || 'Elite Series'}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product._id}`);
          }}
          className="absolute bottom-3 right-3 rounded-full bg-white/15 border border-white/20 p-2 text-white hover:bg-primary hover:text-slate-900 transition"
        >
          <Eye size={16} />
        </button>
        <p className="absolute left-3 bottom-3 text-xs text-slate-100">{product.category || 'Football Clubs'}</p>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex text-yellow-300">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.round(product.rating || 0) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-xs text-slate-300 ml-1">({product.reviews?.length || 0})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-primary">{formatPrice(product.discountPrice || product.price)}</span>
            {product.discountPrice && (
              <span className="text-sm text-slate-400 line-through ml-2">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="text-xs text-slate-300">Stock: {product.stock || 12}</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {productSizes.map((size) => (
            <span key={size} className="premium-chip text-[11px]">
              {size}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare(product);
              }}
              className="btn-ripple rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-primary hover:text-primary transition"
            >
              Compare
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product._id}`);
            }}
            className="btn-ripple flex-1 border border-primary/40 text-primary py-2 rounded-lg hover:bg-primary hover:text-slate-900 transition text-sm font-semibold"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            className="btn-ripple flex-1 bg-gradient-to-r from-primary to-accent text-slate-900 py-2 rounded-lg hover:shadow-neon transition flex items-center justify-center gap-2 text-sm font-bold"
          >
            <ShoppingCart size={16} /> Add
          </button>
          <button
            onClick={handleAddToWishlist}
            className="w-11 border border-secondary/60 text-secondary py-2 rounded-lg hover:bg-secondary hover:text-white transition"
          >
            <Heart size={16} className="mx-auto" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
