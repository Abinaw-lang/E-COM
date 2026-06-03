# E-Commerce Application - Testing Guide

## Overview
This guide covers manual testing, automated testing, and deployment validation for the e-commerce platform.

---

## Part 1: Manual Testing

### 1.1 Authentication Testing

#### Test Case 1.1.1: User Registration
**Steps:**
1. Navigate to `/register`
2. Fill in form with:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: Password@123
3. Click "Register"

**Expected Result:**
- User account created
- Redirected to home page
- User logged in automatically

#### Test Case 1.1.2: User Login
**Steps:**
1. Logout if logged in
2. Navigate to `/login`
3. Enter valid credentials
4. Click "Login"

**Expected Result:**
- User logged in
- Token stored in localStorage
- Redirected to home page

#### Test Case 1.1.3: Forgot Password
**Steps:**
1. On login page, click "Forgot Password?"
2. Enter email address
3. Submit form

**Expected Result:**
- Success message shown
- (Email should be sent - check logs)

#### Test Case 1.1.4: Token Refresh
**Steps:**
1. Login to application
2. Wait 5+ minutes
3. Make any API request (navigate to cart, update profile)

**Expected Result:**
- Application continues to work
- New token generated silently
- No logout occurs

### 1.2 Product Browsing Testing

#### Test Case 1.2.1: View All Products
**Steps:**
1. Click "Shop" or navigate to `/products`
2. Verify products display

**Expected Result:**
- Product list displays correctly
- Each product shows: image, name, price, discount, rating
- Pagination works (if products > 12)

#### Test Case 1.2.2: Product Filtering
**Steps:**
1. On products page, use sidebar filters:
   - Search by name
   - Filter by category
   - Filter by price range
2. Apply filters

**Expected Result:**
- Products filtered correctly
- Count updates to show filtered results
- Multiple filters work together

#### Test Case 1.2.3: Product Sorting
**Steps:**
1. Use "Sort by" dropdown
2. Try each option: Newest, Price (Low-High), Price (High-Low), Top Rated

**Expected Result:**
- Products re-sort correctly
- Order changes visibly

#### Test Case 1.2.4: Product Detail Page
**Steps:**
1. Click on any product card
2. Verify all information displays

**Expected Result:**
- Product details display: images, price, description, rating, reviews
- Review section shows customer feedback
- Add to cart and wishlist buttons visible

### 1.3 Shopping Cart Testing

#### Test Case 1.3.1: Add to Cart
**Steps:**
1. Go to product detail page
2. Set quantity to 2
3. Click "Add to Cart"

**Expected Result:**
- Toast notification shows success
- Cart count in navbar updates
- Product appears in cart page

#### Test Case 1.3.2: Update Cart Quantity
**Steps:**
1. Go to cart page
2. Change product quantity
3. Verify total updates

**Expected Result:**
- Quantity updates
- Total price recalculates instantly

#### Test Case 1.3.3: Remove from Cart
**Steps:**
1. On cart page, click delete icon
2. Confirm action

**Expected Result:**
- Product removed from cart
- Cart count updates
- Total recalculates

#### Test Case 1.3.4: Clear Cart
**Steps:**
1. On cart page, click "Clear Cart"
2. Confirm action

**Expected Result:**
- All items removed
- Cart empty message shows
- Cart count becomes 0

### 1.4 Wishlist Testing

#### Test Case 1.4.1: Add to Wishlist
**Steps:**
1. Click heart icon on product card
2. Navigate to wishlist

**Expected Result:**
- Product added to wishlist
- Wishlist count increases
- Product appears in wishlist page

#### Test Case 1.4.2: Remove from Wishlist
**Steps:**
1. On wishlist page or product detail, click delete
2. Confirm

**Expected Result:**
- Product removed from wishlist
- Count decreases

#### Test Case 1.4.3: Move to Cart from Wishlist
**Steps:**
1. On wishlist page, click "Add to Cart"

**Expected Result:**
- Product moves to cart
- Product removed from wishlist

### 1.5 Checkout & Payment Testing

#### Test Case 1.5.1: Complete Checkout with Test Payment
**Steps:**
1. Add products to cart
2. Go to checkout
3. Fill in shipping address
4. Select billing address option
5. Click "Place Order"
6. In Razorpay popup:
   - Use test card: 4111111111111111
   - Expiry: Any future date
   - CVV: Any 3 digits
7. Click "Pay" button

**Expected Result:**
- Payment succeeds (test mode)
- Order created
- Redirect to success page
- Order appears in user profile

#### Test Case 1.5.2: Checkout Validation
**Steps:**
1. Try checkout without required fields
2. Try with invalid address

**Expected Result:**
- Errors show for required fields
- Cannot proceed without valid data

### 1.6 User Profile Testing

#### Test Case 1.6.1: View Profile
**Steps:**
1. Login and go to `/user-profile`
2. Verify all tabs display

**Expected Result:**
- Profile information displays correctly
- All orders show in Orders tab
- Saved addresses display correctly

#### Test Case 1.6.2: Update Profile
**Steps:**
1. On Profile tab, update name or phone
2. Click Save

**Expected Result:**
- Changes saved
- Success message shown
- Data persists on refresh

#### Test Case 1.6.3: View Order Details
**Steps:**
1. On Orders tab, click on an order

**Expected Result:**
- Order detail page opens
- All product, shipping, and payment info displays

### 1.7 Dark Mode Testing

#### Test Case 1.7.1: Toggle Dark Mode
**Steps:**
1. Click moon/sun icon in navbar
2. Verify colors change

**Expected Result:**
- Dark mode activates/deactivates
- Color scheme appropriate
- Setting persists on refresh

### 1.8 Responsive Design Testing

#### Test Case 1.8.1: Mobile View
**Steps:**
1. Open DevTools (F12)
2. Toggle Device Toolbar
3. Test on mobile sizes: 320px, 768px, 1024px

**Expected Result:**
- Layout adapts correctly
- Touch-friendly buttons
- Navigation works on mobile
- No horizontal scrolling

#### Test Case 1.8.2: Tablet View
**Steps:**
1. Test at 768px width
2. Verify sidebar and main content

**Expected Result:**
- Sidebar toggles properly
- Content readable
- Images scale appropriately

---

## Part 2: API Testing

### Using Thunder Client / Postman

#### Test 2.1: Authentication Endpoints

**POST /api/auth/register**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "TestPass@123"
}
```

**POST /api/auth/login**
```json
{
  "email": "test@example.com",
  "password": "TestPass@123"
}
```

Expected: Returns JWT token and refresh token

**POST /api/auth/refresh-token**
Headers: `Authorization: Bearer <token>`

Expected: Returns new JWT token

---

#### Test 2.2: Product Endpoints

**GET /api/products**
Query params:
- `category=electronics`
- `minPrice=1000&maxPrice=50000`
- `sortBy=price&order=asc`
- `page=1&limit=12`

**GET /api/products/featured**

Expected: Returns array of featured products

**GET /api/products/:id**

Expected: Returns full product with reviews

---

#### Test 2.3: Cart Endpoints

**POST /api/cart**
Headers: `Authorization: Bearer <token>`
```json
{
  "productId": "67890abc",
  "quantity": 2
}
```

**GET /api/cart**
Headers: `Authorization: Bearer <token>`

Expected: Returns user's cart

**PUT /api/cart/:itemId**
```json
{
  "quantity": 3
}
```

**DELETE /api/cart/:itemId**

---

#### Test 2.4: Order Endpoints

**POST /api/orders**
Headers: `Authorization: Bearer <token>`
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  },
  "billingAddress": {
    "sameAsShipping": true
  }
}
```

**GET /api/orders**
Headers: `Authorization: Bearer <token>`

Expected: Returns user's orders

**GET /api/orders/:id**
Headers: `Authorization: Bearer <token>`

Expected: Returns order details

---

#### Test 2.5: Review Endpoints

**POST /api/reviews**
Headers: `Authorization: Bearer <token>`
```json
{
  "productId": "67890abc",
  "rating": 5,
  "comment": "Great product!",
  "verifiedPurchase": true
}
```

**GET /api/reviews/:productId**

Expected: Returns product reviews

---

## Part 3: Load Testing

### Using Apache JMeter or K6

#### Test 3.1: Concurrent Users
- Simulate 100 concurrent users
- Each user: Browse → Search → Add to Cart → Checkout
- Duration: 5 minutes

**Expected Metrics:**
- Response time < 2s
- No errors
- Server CPU < 80%
- Memory stable

#### Test 3.2: High Load
- Simulate 500 concurrent users
- Heavy product search and filtering
- Duration: 5 minutes

**Expected Metrics:**
- Response time < 5s
- Error rate < 1%
- Database queries optimized

---

## Part 4: Security Testing

### 4.1 Authentication Security
- [ ] JWT tokens cannot be forged
- [ ] Expired tokens are rejected
- [ ] Invalid tokens return 401
- [ ] Passwords are hashed, never stored plain text
- [ ] Refresh token rotation works

### 4.2 Authorization Security
- [ ] Non-authenticated users cannot access protected routes
- [ ] Non-admin users cannot access admin endpoints
- [ ] Users cannot access other users' data
- [ ] Users cannot modify others' orders/profiles

### 4.3 Data Validation
- [ ] Invalid email rejected
- [ ] Short passwords rejected
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] CSRF tokens validated

### 4.4 API Security
- [ ] CORS enabled only for whitelisted domains
- [ ] Rate limiting prevents brute force
- [ ] Helmet headers set correctly
- [ ] HTTPS enforced in production
- [ ] No sensitive data in logs

---

## Part 5: Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

**Check:**
- All features work
- CSS renders correctly
- No console errors
- Responsive design works

---

## Part 6: Payment Testing

### 6.1 Razorpay Test Credentials

**Test Card Numbers:**
| Type | Card Number | Status |
|------|-------------|--------|
| Visa | 4111111111111111 | Success |
| Visa | 4222222222222220 | Failed |
| Mastercard | 5555555555554444 | Success |

**Expiry:** Any future date (MM/YY)
**CVV:** Any 3 digits

### 6.2 Test Scenarios
- [ ] Successful payment
- [ ] Failed payment recovery
- [ ] Payment timeout handling
- [ ] Order creation after payment
- [ ] Order status updates
- [ ] Payment verification

---

## Part 7: Database Testing

### 7.1 MongoDB Operations
```bash
# Connect to MongoDB Atlas
mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Check collections
use ecommerce
db.getCollectionNames()

# Sample queries
db.products.find().limit(5)
db.orders.find({ "userId": "xxx" })
db.users.findOne({ "email": "test@example.com" })
```

### 7.2 Index Performance
- Verify indexes on frequently queried fields
- Check query performance with `.explain()`
- Monitor slow queries

---

## Part 8: Performance Testing

### 8.1 Frontend Performance
```bash
# Check bundle size
npm run build
# Check output size in dist/

# Lighthouse audit
# Chrome DevTools → Lighthouse
# Target: Performance > 80
```

### 8.2 Backend Performance
- API response time < 200ms (excluding payment)
- Database query time < 50ms
- Image loading < 500ms

---

## Part 9: Bug Report Template

When reporting issues:

```
## Bug Title: [Brief description]

### Environment:
- OS: Windows 10 / Mac / Linux
- Browser: Chrome 120
- Device: Desktop / Mobile

### Steps to Reproduce:
1. Go to [page]
2. Click [element]
3. Fill [form]
4. Observe issue

### Expected Behavior:
[What should happen]

### Actual Behavior:
[What actually happens]

### Screenshots:
[Attach screenshots]

### Console Errors:
[Paste error messages]

### Additional Info:
[Any other relevant info]
```

---

## Part 10: Regression Testing Checklist

After each update, verify:

### Authentication
- [ ] Login/Register works
- [ ] Token refresh works
- [ ] Logout works
- [ ] Protected routes blocked without auth

### Products
- [ ] Products display
- [ ] Filters work
- [ ] Sorting works
- [ ] Search works
- [ ] Product detail loads

### Shopping
- [ ] Add to cart works
- [ ] Cart updates
- [ ] Remove from cart works
- [ ] Checkout process works
- [ ] Payment integration works

### User Profile
- [ ] Profile displays
- [ ] Profile updates
- [ ] Orders display
- [ ] Order details work
- [ ] Addresses work

### UI/UX
- [ ] No console errors
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] Animations smooth
- [ ] Loading states show

---

## Testing Summary Report

```
Date: [Date]
Tester: [Name]
Build Version: [Version]

### Test Execution Summary
- Total Test Cases: 50
- Passed: [Number]
- Failed: [Number]
- Blocked: [Number]
- Pass Rate: [Percentage]

### Critical Issues: [Number]
- [Issue 1]
- [Issue 2]

### Major Issues: [Number]
- [Issue 1]
- [Issue 2]

### Minor Issues: [Number]
- [Issue 1]

### Recommendations:
- [Recommendation 1]
- [Recommendation 2]

### Sign Off:
- QA Approval: [Yes/No]
- Ready for Deployment: [Yes/No]
```

---

## Contact & Support

For testing support:
- GitHub Issues: [Repository Issues Page]
- Email: qa@ecommerce.com
- Slack Channel: #testing
