# E-Commerce API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-render-url.com/api`

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { /* response data */ }
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 2. Login User
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: Same as Register

### 3. Refresh Token
**POST** `/auth/refresh-token`

Request Body:
```json
{
  "refreshToken": "refresh_token"
}
```

Response:
```json
{
  "success": true,
  "token": "new_jwt_token"
}
```

### 4. Logout
**POST** `/auth/logout`
*Requires Authentication*

### 5. Get Current User
**GET** `/auth/me`
*Requires Authentication*

### 6. Forgot Password
**POST** `/auth/forgot-password`

Request Body:
```json
{
  "email": "john@example.com"
}
```

### 7. Reset Password
**PUT** `/auth/reset-password/:token`

Request Body:
```json
{
  "password": "newpassword123"
}
```

---

## User Endpoints

### 1. Get Profile
**GET** `/users/profile`
*Requires Authentication*

### 2. Update Profile
**PUT** `/users/profile`
*Requires Authentication*

Request Body:
```json
{
  "name": "Jane Doe",
  "phone": "9876543210"
}
```

### 3. Change Password
**PUT** `/users/change-password`
*Requires Authentication*

Request Body:
```json
{
  "oldPassword": "current_password",
  "newPassword": "new_password"
}
```

### 4. Add Address
**POST** `/users/addresses`
*Requires Authentication*

Request Body:
```json
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA"
}
```

### 5. Update Address
**PUT** `/users/addresses/:id`
*Requires Authentication*

### 6. Delete Address
**DELETE** `/users/addresses/:id`
*Requires Authentication*

### 7. Get All Users
**GET** `/users`
*Requires Admin Role*

---

## Product Endpoints

### 1. Get All Products
**GET** `/products?category=Electronics&minPrice=100&maxPrice=50000&search=phone&sort=price:asc&page=1&limit=10`

Query Parameters:
- `category`: Filter by category
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `search`: Search term
- `sort`: Sort field and order (field:asc or field:desc)
- `page`: Page number
- `limit`: Items per page

### 2. Get Product by ID
**GET** `/products/:id`

### 3. Get Featured Products
**GET** `/products/featured`

### 4. Get Categories
**GET** `/products/categories`

### 5. Create Product
**POST** `/products`
*Requires Admin Role*

Request Body:
```json
{
  "title": "Product Name",
  "description": "Product description",
  "category": "Electronics",
  "price": 299.99,
  "discountPrice": 249.99,
  "stock": 100,
  "images": [
    {
      "url": "image_url",
      "publicId": "cloudinary_public_id"
    }
  ]
}
```

### 6. Update Product
**PUT** `/products/:id`
*Requires Admin Role*

### 7. Delete Product
**DELETE** `/products/:id`
*Requires Admin Role*

---

## Cart Endpoints

### 1. Get Cart
**GET** `/cart`
*Requires Authentication*

### 2. Add to Cart
**POST** `/cart/add`
*Requires Authentication*

Request Body:
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

### 3. Update Cart Item
**PUT** `/cart/items/:productId`
*Requires Authentication*

Request Body:
```json
{
  "quantity": 2
}
```

### 4. Remove from Cart
**DELETE** `/cart/items/:productId`
*Requires Authentication*

### 5. Clear Cart
**DELETE** `/cart`
*Requires Authentication*

---

## Wishlist Endpoints

### 1. Get Wishlist
**GET** `/wishlist`
*Requires Authentication*

### 2. Add to Wishlist
**POST** `/wishlist/add`
*Requires Authentication*

Request Body:
```json
{
  "productId": "product_id"
}
```

### 3. Remove from Wishlist
**DELETE** `/wishlist/items/:productId`
*Requires Authentication*

---

## Order Endpoints

### 1. Create Order
**POST** `/orders`
*Requires Authentication*

Request Body:
```json
{
  "products": [
    {
      "productId": "product_id",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "billingAddress": { ... },
  "couponCode": "SAVE10"
}
```

### 2. Get User Orders
**GET** `/orders`
*Requires Authentication*

### 3. Get Order by ID
**GET** `/orders/:id`
*Requires Authentication*

### 4. Create Razorpay Order
**POST** `/orders/razorpay/create-order`
*Requires Authentication*

Request Body:
```json
{
  "amount": 1000,
  "orderId": "order_id"
}
```

### 5. Verify Payment
**POST** `/orders/razorpay/verify-payment`
*Requires Authentication*

Request Body:
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature",
  "orderId": "our_order_id"
}
```

### 6. Update Order Status
**PUT** `/orders/:id`
*Requires Admin Role*

Request Body:
```json
{
  "orderStatus": "shipped",
  "trackingNumber": "TRACK123"
}
```

### 7. Get All Orders
**GET** `/orders/admin/all`
*Requires Admin Role*

---

## Review Endpoints

### 1. Get Product Reviews
**GET** `/reviews/:productId`

### 2. Add Review
**POST** `/reviews`
*Requires Authentication*

Request Body:
```json
{
  "productId": "product_id",
  "rating": 5,
  "comment": "Great product!"
}
```

### 3. Delete Review
**DELETE** `/reviews/:id`
*Requires Authentication (Own Review) or Admin*

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limiting
API endpoints are rate limited to 100 requests per 15 minutes per IP.

## Pagination
Paginated endpoints return:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```
