# E-Commerce Web Application

A production-ready, full-stack e-commerce application built with modern technologies.

## Tech Stack

### Frontend
- **React.js** - UI Library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Framer Motion** - Animations
- **React Toastify** - Notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **Helmet** - Security
- **CORS** - Cross-origin requests
- **Express Validator** - Input validation

## Features

### Authentication & Authorization
✅ User Registration & Login
✅ JWT Authentication with Refresh Tokens
✅ Password Hashing with Bcrypt
✅ Role-Based Authorization (User/Admin)
✅ Protected Routes
✅ Forgot Password & Reset Password
✅ Logout Functionality

### Homepage
✅ Modern Hero Section
✅ Featured Products
✅ Product Categories
✅ Responsive Navigation
✅ Dark Mode Toggle
✅ Footer

### Product Management
✅ Product Listing with Filters
✅ Product Search
✅ Filter by Category
✅ Filter by Price Range
✅ Sort by Price
✅ Product Details Page
✅ Product Image Gallery
✅ Product Reviews & Ratings

### Shopping Features
✅ Shopping Cart (Add, Remove, Update Quantity)
✅ Persistent Cart (Saved in Database)
✅ Wishlist Management
✅ Move Items from Wishlist to Cart

### Checkout & Payment
✅ Shipping Address Form
✅ Billing Details
✅ Order Summary
✅ Razorpay Payment Integration
✅ Payment Verification
✅ Order Confirmation

### User Dashboard
✅ User Profile Management
✅ Update User Information
✅ Change Password
✅ View Orders
✅ Track Orders
✅ Manage Addresses
✅ Wishlist Management

### Admin Dashboard
✅ Admin Authentication
✅ User Management
✅ Product Management (Add, Edit, Delete)
✅ Order Management
✅ Update Order Status
✅ Sales Analytics
✅ Revenue Reports

## Project Structure

```
E-commerce/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business services
│   ├── validators/      # Input validation
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── layouts/     # Layout components
    │   ├── routes/      # Route guards
    │   ├── context/     # Context providers
    │   ├── services/    # API services
    │   ├── utils/       # Utility functions
    │   ├── hooks/       # Custom hooks
    │   ├── assets/      # Images and static files
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── index.html
```

## Quick Start

For complete setup and deployment guides, refer to:
- **[SETUP.md](./SETUP.md)** - Local development setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[TESTING.md](./TESTING.md)** - Testing procedures
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues & solutions
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API endpoints
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database structure

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
PORT=5000
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_razorpay_key
```

5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users` - Get all users (Admin)

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get categories
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/items/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/razorpay/create-order` - Create Razorpay order
- `POST /api/orders/razorpay/verify-payment` - Verify payment
- `PUT /api/orders/:id` - Update order status (Admin)
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Add review
- `DELETE /api/reviews/:id` - Delete review

## Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user/admin),
  addresses: Array,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Products
```javascript
{
  title: String,
  description: String,
  category: String,
  price: Number,
  discountPrice: Number,
  images: Array,
  stock: Number,
  rating: Number,
  reviews: Array,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders
```javascript
{
  userId: ObjectId,
  products: Array,
  shippingAddress: Object,
  totalAmount: Number,
  paymentStatus: String,
  orderStatus: String,
  paymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId,
  products: Array,
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect GitHub repo to Render
3. Set environment variables in Render
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Add to backend `.env`

## Security Features

✅ Helmet for HTTP headers security
✅ CORS protection
✅ Rate limiting (can be added)
✅ Input validation
✅ JWT token verification
✅ Password hashing with Bcrypt
✅ Secure password reset
✅ Environment variables for secrets
✅ MongoDB injection protection

## Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced analytics
- [ ] Inventory management
- [ ] Multiple payment gateways
- [ ] Product recommendations
- [ ] Social sharing
- [ ] Loyalty program
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications with WebSocket

## Contributing

Contributions are welcome! Please follow the project structure and coding standards.

## License

MIT License

## Support

For support, email support@estore.com or create an issue in the repository.
