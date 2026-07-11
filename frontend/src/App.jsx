import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

const Home = React.lazy(() => import('./pages/Home'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Jerseys = React.lazy(() => import('./pages/Jerseys'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const OrderDetail = React.lazy(() => import('./pages/OrderDetail'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./pages/AdminProducts'));
const AdminCategories = React.lazy(() => import('./pages/AdminCategories'));
const AdminOrders = React.lazy(() => import('./pages/AdminOrders'));
const AdminCustomers = React.lazy(() => import('./pages/AdminCustomers'));
const AdminReviews = React.lazy(() => import('./pages/AdminReviews'));
const AdminCoupons = React.lazy(() => import('./pages/AdminCoupons'));
const AdminNotifications = React.lazy(() => import('./pages/AdminNotifications'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Collections = React.lazy(() => import('./pages/Collections'));
const CustomJersey = React.lazy(() => import('./pages/CustomJersey'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

const CursorGlow = () => {
  const [position, setPosition] = React.useState({ x: -100, y: -100 });

  React.useEffect(() => {
    const handler = (event) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return <div className="cursor-glow hidden lg:block" style={{ left: position.x, top: position.y }} />;
};

function App() {
  return (
    <BrowserRouter>
      <CursorGlow />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full border-b-2 border-primary animate-spin" />
                </div>
              }
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/jerseys" element={<Jerseys />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/custom-jersey" element={<CustomJersey />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <AdminCategories />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/customers"
                  element={
                    <AdminRoute>
                      <AdminCustomers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <AdminRoute>
                      <AdminReviews />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/coupons"
                  element={
                    <AdminRoute>
                      <AdminCoupons />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/notifications"
                  element={
                    <AdminRoute>
                      <AdminNotifications />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="/404" element={<NotFound />} />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
