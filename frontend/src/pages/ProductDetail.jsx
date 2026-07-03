import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import MainLayout from '../layouts/MainLayout';
import { productService, reviewService } from '../services';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

const Jersey3D = ({ color, frontView }) => {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.9}>
      <group rotation={[0, frontView ? 0 : Math.PI, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.6, 2.1, 0.45]} />
          <meshStandardMaterial color={color} roughness={0.38} metalness={0.15} />
        </mesh>
        <mesh position={[-1.15, 0.4, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.65, 0.9, 0.45]} />
          <meshStandardMaterial color="#131722" />
        </mesh>
        <mesh position={[1.15, 0.4, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.65, 0.9, 0.45]} />
          <meshStandardMaterial color="#131722" />
        </mesh>
      </group>
    </Float>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#3a6bff');
  const [frontView, setFrontView] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        const loadedProduct = res.data.data;
        setProduct(loadedProduct);

        const previous = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const merged = [loadedProduct, ...previous.filter((item) => item._id !== loadedProduct._id)].slice(0, 8);
        localStorage.setItem('recentlyViewed', JSON.stringify(merged));

        const reviewRes = await reviewService.getProductReviews(id);
        setReviews(reviewRes.data.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product._id);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) return null;

  const avgRating = product.rating || 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[0]?.url || '/placeholder.jpg'}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt="thumbnail"
                  className="w-20 h-20 object-cover rounded cursor-pointer hover:border-2 border-primary"
                />
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-gray-600 ml-2">({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-gray-500 line-through ml-4">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">In Stock</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-300 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="font-semibold mb-2">Choose Color</p>
              <div className="flex gap-2">
                {['#3a6bff', '#ef3340', '#f2f4ff', '#0f1218'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Color ${color}`}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-white/20'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2">Select Size</p>
              <div className="flex gap-2">
                {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md px-3 py-1 border ${selectedSize === size ? 'border-primary bg-primary/10 text-primary' : 'border-white/20 text-slate-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label className="font-semibold">Quantity:</label>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-0"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-1 border-2 border-primary text-primary py-3 rounded-lg hover:bg-primary hover:text-white transition flex items-center justify-center gap-2"
              >
                <Heart /> Wishlist
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-4">
                <Truck className="text-primary" />
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-4">
                <Shield className="text-primary" />
                <span>Secure payment with encryption</span>
              </div>
            </div>
          </motion.div>
        </div>

        <section className="glass-card rounded-2xl p-4 sm:p-8 mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">3D Product View</h2>
            <button
              type="button"
              onClick={() => setFrontView((value) => !value)}
              className="btn-ripple inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 hover:border-primary transition"
            >
              <RotateCcw size={16} /> Switch {frontView ? 'Back' : 'Front'}
            </button>
          </div>
          <div className="h-[380px] rounded-2xl bg-black/35 border border-white/10">
            <Canvas camera={{ position: [0, 0.8, 4.2], fov: 46 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 3, 2]} intensity={1.4} color="#6fc2ff" />
              <pointLight position={[-2, 1, 2]} intensity={5} color="#ef3340" />
              <Jersey3D color={selectedColor} frontView={frontView} />
              <OrbitControls enablePan={false} minDistance={2.8} maxDistance={6} />
            </Canvas>
          </div>
          <p className="text-sm text-slate-300 mt-4">Rotate and zoom with mouse. Selected size: {selectedSize}</p>
        </section>

        {/* Reviews Section */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{review.userName}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
