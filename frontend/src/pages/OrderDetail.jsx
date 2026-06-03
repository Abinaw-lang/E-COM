import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { orderService } from '../services';
import MainLayout from '../layouts/MainLayout';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: Package,
  cancelled: Package,
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      setOrder(response.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/user-profile')}
              className="flex items-center gap-2 text-primary mb-6 hover:text-primary-dark"
            >
              <ArrowLeft size={20} />
              Back to Profile
            </button>
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-600 text-lg">{error || 'Order not found'}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const StatusIcon = statusIcons[order.orderStatus] || CheckCircle;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate('/user-profile')}
            className="flex items-center gap-2 text-primary mb-6 hover:text-primary-dark"
          >
            <ArrowLeft size={20} />
            Back to Profile
          </button>

          {/* Order Header Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
                <p className="text-gray-600">Order ID: <span className="font-semibold">{order._id}</span></p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[order.orderStatus]}`}>
                <StatusIcon size={20} />
                <span className="font-semibold capitalize">{order.orderStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="font-semibold text-lg text-primary">₹{order.totalPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <p className={`font-semibold ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <p className="font-semibold">{order.trackingNumber || 'Not assigned'}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.products.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">₹{item.price}</p>
                    <p className="text-sm text-gray-600">
                      ₹{(item.price * item.quantity).toFixed(2)} total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zip}, {order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="flex items-center gap-2 pt-2">
                    <Phone size={16} /> {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-secondary" />
                Billing Address
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">{order.billingAddress.street}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state}</p>
                <p>{order.billingAddress.zip}, {order.billingAddress.country}</p>
                {order.billingAddress.phone && (
                  <p className="flex items-center gap-2 pt-2">
                    <Phone size={16} /> {order.billingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{(order.totalPrice - 50).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹50.00</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span className="text-primary">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm">
              For questions about this order, please contact our support team at{' '}
              <a href="mailto:support@ecommerce.com" className="text-primary hover:underline">
                support@ecommerce.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
