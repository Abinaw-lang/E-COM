# 🛠️ Admin Dashboard Setup Guide

## Admin Account Created ✅

**Email:** `admin@ecommerce.com`  
**Password:** `admin123`

> ⚠️ **IMPORTANT:** Change this password after your first login!

---

## 🚀 How to Access Admin Dashboard

### Step 1: Login as Admin
1. Go to `http://localhost:5173/login`
2. Enter:
   - **Email:** `admin@ecommerce.com`
   - **Password:** `admin123`
3. Click **Login**

### Step 2: Access Admin Panel
After login, you'll see **"Admin Dashboard"** in the user menu (top-right corner).

**Admin Pages Available:**
- 📊 **Admin Dashboard** → `http://localhost:5173/admin`
- 📦 **Manage Products** → `http://localhost:5173/admin/products`

---

## 📊 Admin Dashboard Features

### Dashboard (`/admin`)
- 📈 View total orders
- 💰 Total revenue
- 📦 Total products
- 👥 Total users

### Products Management (`/admin/products`)
- ✅ **Add New Product** - Create new products with details
- ✏️ **Edit Product** - Modify existing products
- 🗑️ **Delete Product** - Remove products from catalog
- 🔍 **Search Products** - Find products quickly

---

## ➕ How to Add a Product

1. Go to `http://localhost:5173/admin/products`
2. Click the **"+ Add Product"** button
3. Fill in the form:
   - **Title:** Product name (e.g., "Nike Shoes")
   - **Description:** Product details
   - **Category:** Select category
   - **Price:** Original price
   - **Discount Price:** Discounted price
   - **Stock:** Quantity available
   - **Images:** Upload product images
4. Click **Save**

---

## 🔐 Authentication Flow

### Admin Login Process
```
1. Admin enters credentials
2. Backend validates email & password
3. If valid, backend checks user.role === 'admin'
4. If admin, JWT token issued
5. Frontend stores token + user data
6. Admin routes now accessible
```

### Protected Admin Routes
- Only users with `role: 'admin'` can access:
  - `/admin` (Dashboard)
  - `/admin/products` (Manage Products)
- Non-admin users redirected to home page

---

## 🛒 API Endpoints for Admin

### Products (Admin Only)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products` - List all products (public)

### Orders (Admin Only)
- `GET /api/orders/admin/all` - View all orders
- `PUT /api/orders/:id` - Update order status

---

## 👥 User Roles

### Regular User (`role: 'user'`)
- ✓ Browse products
- ✓ Add to cart
- ✓ Place orders
- ✓ View wishlist
- ✗ Cannot manage products

### Admin User (`role: 'admin'`)
- ✓ All user permissions
- ✓ Add/Edit/Delete products
- ✓ View all orders
- ✓ Update order status
- ✓ Access admin dashboard

---

## 🔧 Creating Additional Admin Accounts

### Option 1: Using the Script
```bash
cd backend
node scripts/createAdmin.js
```

This creates a new admin with:
- Email: `admin@ecommerce.com`
- Password: `admin123`

### Option 2: Manually (Database)
```javascript
// Connect to MongoDB and insert:
db.users.insertOne({
  name: "Your Name",
  email: "youremail@example.com",
  password: "hashedPassword",
  phone: "9999999999",
  role: "admin",
  profileImage: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🔑 Change Admin Password

1. Login to admin account
2. Go to User Profile
3. Update password (Note: implement this feature if needed)
4. Logout and re-login with new password

---

## 📱 Frontend Admin Features Implemented

✅ **AdminRoute.jsx** - Protects admin pages  
✅ **AdminDashboard.jsx** - Shows dashboard stats  
✅ **AdminProducts.jsx** - Product management UI  
✅ **Navbar.jsx** - Shows "Admin Dashboard" link for admins  
✅ **App.jsx** - Routes configured for admin pages  

---

## 🐛 Troubleshooting

### Admin Dashboard Not Showing?
1. Make sure you're logged in as admin
2. Check user role in MongoDB: `role: "admin"`
3. Clear browser cache and refresh

### Can't Add Products?
1. Verify JWT token is sent in headers
2. Check backend is running: `http://localhost:5000`
3. Check MongoDB connection

### 404 on Admin Pages?
1. Make sure frontend is running: `http://localhost:5173`
2. Check routes are added to App.jsx
3. Verify user is logged in as admin

---

## 📧 Support

For issues, check:
- Backend server logs: Port 5000
- Frontend console: F12 → Console tab
- MongoDB connection status

---

**Created:** June 3, 2026  
**Status:** ✅ Active and Ready to Use
