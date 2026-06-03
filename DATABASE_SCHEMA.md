# Database Collections Schema

## Users Collection
```javascript
db.users.insertOne({
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed with bcrypt
  phone: String,
  role: String, // "user" or "admin"
  profileImage: String,
  addresses: [
    {
      _id: ObjectId,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: Boolean
    }
  ],
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
})

// Index
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phone: 1 }, { sparse: true })
```

## Products Collection
```javascript
db.products.insertOne({
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // "Electronics", "Clothing", etc.
  price: Number,
  discountPrice: Number,
  images: [
    {
      _id: ObjectId,
      url: String,
      publicId: String
    }
  ],
  stock: Number,
  rating: Number,
  reviews: [
    {
      _id: ObjectId,
      userId: ObjectId,
      userName: String,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],
  sku: String,
  tags: [String],
  isFeatured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
})

// Indexes
db.products.createIndex({ title: "text", description: "text" })
db.products.createIndex({ category: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ rating: -1 })
db.products.createIndex({ sku: 1 }, { unique: true, sparse: true })
```

## Orders Collection
```javascript
db.orders.insertOne({
  _id: ObjectId,
  userId: ObjectId,
  products: [
    {
      _id: ObjectId,
      productId: ObjectId,
      title: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: { ... },
  totalAmount: Number,
  shippingCost: Number,
  discount: Number,
  couponCode: String,
  paymentMethod: String, // "razorpay", "wallet", "cod"
  paymentStatus: String, // "pending", "completed", "failed"
  paymentId: String,
  orderId: String,
  orderStatus: String, // "pending", "confirmed", "shipped", "delivered", "cancelled"
  trackingNumber: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
})

// Indexes
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ orderStatus: 1 })
```

## Cart Collection
```javascript
db.carts.insertOne({
  _id: ObjectId,
  userId: ObjectId,
  products: [
    {
      _id: ObjectId,
      productId: ObjectId,
      quantity: Number,
      price: Number,
      image: String,
      addedAt: Date
    }
  ],
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
})

// Index
db.carts.createIndex({ userId: 1 }, { unique: true })
```

## Wishlist Collection
```javascript
db.wishlists.insertOne({
  _id: ObjectId,
  userId: ObjectId,
  products: [
    {
      _id: ObjectId,
      productId: ObjectId,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
})

// Index
db.wishlists.createIndex({ userId: 1 }, { unique: true })
```

## Reviews Collection
```javascript
db.reviews.insertOne({
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  rating: Number,
  comment: String,
  verifiedPurchase: Boolean,
  helpful: Number,
  createdAt: Date,
  updatedAt: Date
})

// Indexes
db.reviews.createIndex({ productId: 1, createdAt: -1 })
db.reviews.createIndex({ userId: 1 })
```

## Coupons Collection
```javascript
db.coupons.insertOne({
  _id: ObjectId,
  code: String,
  discountType: String, // "percentage" or "fixed"
  discountValue: Number,
  minOrderAmount: Number,
  maxUses: Number,
  usedCount: Number,
  isActive: Boolean,
  expiryDate: Date,
  createdAt: Date,
  updatedAt: Date
})

// Index
db.coupons.createIndex({ code: 1 }, { unique: true })
db.coupons.createIndex({ isActive: 1, expiryDate: 1 })
```

## MongoDB Best Practices

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Create Database User
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Database Access → Add Database User
4. Create user with appropriate permissions

### Backup Strategy
- Enable automated backups in MongoDB Atlas
- Set backup frequency to daily
- Retain backups for 30 days

### Performance Optimization
- Create indexes on frequently queried fields
- Use text indexes for search functionality
- Monitor query performance using Atlas monitoring
- Use connection pooling (recommended in production)

### Security
- Use strong passwords for database users
- Restrict IP addresses
- Enable encryption at rest
- Use SSL/TLS for connections
- Enable audit logs

### Queries Examples

#### Get product with reviews
```javascript
db.products.aggregate([
  { $match: { _id: ObjectId("...") } },
  { $lookup: {
    from: "reviews",
    localField: "_id",
    foreignField: "productId",
    as: "reviews"
  }}
])
```

#### Get user's cart with product details
```javascript
db.carts.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $lookup: {
    from: "products",
    localField: "products.productId",
    foreignField: "_id",
    as: "productDetails"
  }}
])
```

#### Get order statistics by month
```javascript
db.orders.aggregate([
  { $group: {
    _id: { $month: "$createdAt" },
    total: { $sum: "$totalAmount" },
    count: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
])
```

#### Get average product rating
```javascript
db.products.aggregate([
  { $lookup: {
    from: "reviews",
    localField: "_id",
    foreignField: "productId",
    as: "reviews"
  }},
  { $addFields: {
    avgRating: { $avg: "$reviews.rating" }
  }}
])
```
