import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';

const ProductCard = ({ product }) => {
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

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      <div className="relative overflow-hidden bg-gray-200 h-64">
        <img
          src={product.images[0]?.url || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-110 transition duration-300"
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          {product.discountPrice ? '-' + Math.round(((product.price - product.discountPrice) / product.price) * 100) + '%' : 'New'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < product.rating ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-1">({product.reviews?.length || 0})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-primary">{formatPrice(product.discountPrice || product.price)}</span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart size={16} /> Add
          </button>
          <button
            onClick={handleAddToWishlist}
            className="flex-1 border border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition"
          >
            <Heart size={16} className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
