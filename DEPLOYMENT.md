# E-Commerce Application - Comprehensive Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
6. [Payment Gateway Setup (Razorpay)](#payment-gateway-setup-razorpay)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Scaling & Performance](#scaling--performance)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] GitHub account (for version control)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Razorpay merchant account
- [ ] Render account (for backend hosting)
- [ ] Vercel account (for frontend hosting)
- [ ] Domain name (optional, for custom domain)

### Local Environment Setup
- Node.js v16+ installed
- npm or yarn package manager
- Git installed and configured
- Code editor (VS Code recommended)
- Postman or Thunder Client for API testing

### Required Knowledge
- Git basics (commit, push)
- Environment variables
- REST APIs
- MongoDB basics
- Payment gateway concepts

---

## Pre-Deployment Checklist

### Code Quality
- [ ] No console.log() statements left in production code
- [ ] No sensitive data in code or comments
- [ ] All required environment variables identified
- [ ] Error handling implemented throughout
- [ ] API error responses meaningful
- [ ] No deprecated code or libraries
- [ ] Code formatted and consistent

### Testing
- [ ] All authentication flows tested
- [ ] Cart operations working correctly
- [ ] Checkout flow tested end-to-end
- [ ] Payment integration working with test keys
- [ ] Product filtering and search working
- [ ] Responsive design verified on mobile/tablet
- [ ] Dark mode functioning
- [ ] No console errors in browser
- [ ] API endpoints responding correctly

### Security
- [ ] JWT secrets are strong and random
- [ ] No API keys exposed in frontend code
- [ ] HTTPS enabled for production
- [ ] CORS configured for production domain
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Helmet headers enabled
- [ ] Password hashing implemented
- [ ] Sensitive logs don't expose data

### Performance
- [ ] Database queries optimized with indexes
- [ ] API response times < 200ms
- [ ] Frontend bundle size reasonable
- [ ] Images optimized and compressed
- [ ] Lazy loading implemented for routes
- [ ] Caching strategy defined

### Documentation
- [ ] README.md complete and clear
- [ ] API documentation updated
- [ ] Database schema documented
- [ ] Setup instructions written
- [ ] Environment variables documented
- [ ] Troubleshooting guide created

---

## Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Update package.json scripts:**
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "jest"
  }
}
```

2. **Verify Procfile or start command:**
```bash
# In backend root, create Procfile (optional)
echo "web: npm start" > Procfile
```

3. **Check .env.example is complete:**
```env
MONGODB_URI=
PORT=
NODE_ENV=production
JWT_SECRET=
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRE=30d
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
FRONTEND_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

4. **Ensure no local dependencies:**
```bash
rm -rf node_modules
npm install --save-exact
```

### Step 2: Push to GitHub

1. **Initialize git in backend (if not done):**
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
```

2. **Create GitHub repository:**
   - Go to github.com
   - Click "New" repository
   - Name: `ecommerce-api`
   - Don't initialize with README
   - Create repository

3. **Push to GitHub:**
```bash
git branch -M main
git remote add origin https://github.com/yourusername/ecommerce-api.git
git push -u origin main
```

### Step 3: Create Render Web Service

1. **Go to render.com**
   - Sign up or log in
   - Click "New +"
   - Select "Web Service"

2. **Connect GitHub Repository**
   - Authorize GitHub
   - Select `ecommerce-api` repository
   - Connect

3. **Configure Settings**
   - **Name:** ecommerce-api
   - **Environment:** Node
   - **Region:** Choose closest to you
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (for testing) or Paid (for production)

4. **Click "Create Web Service"**
   - Wait for build to complete
   - Note the URL: `https://ecommerce-api.onrender.com`

### Step 4: Set Environment Variables

1. **In Render Dashboard:**
   - Go to Web Service → Environment
   - Click "Add Environment Variable"

2. **Add each variable:**
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=<generate-strong-secret>
   REFRESH_TOKEN_EXPIRE=30d
   RAZORPAY_KEY_ID=rzp_live_xxx
   RAZORPAY_KEY_SECRET=xxx
   FRONTEND_URL=https://yourdomain.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=app-specific-password
   EMAIL_FROM=noreply@ecommerce.com
   ```

3. **Click "Save Changes"**
   - Service will redeploy automatically

### Step 5: Test Backend Deployment

```bash
# Test health endpoint
curl https://ecommerce-api.onrender.com/api/health

# Should return: { "status": "API is running" }

# Test MongoDB connection by registering user
curl -X POST https://ecommerce-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "phone":"9876543210",
    "password":"TestPass@123"
  }'
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Verify vite.config.js:**
```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ecommerce-api.onrender.com',
        changeOrigin: true
      }
    }
  }
})
```

2. **Create/Verify .env file:**
```env
VITE_API_URL=https://ecommerce-api.onrender.com/api
VITE_RAZORPAY_KEY=rzp_live_xxx
```

3. **Build locally to test:**
```bash
cd frontend
npm run build
npm run preview
```

4. **Verify build succeeded:**
   - Check `dist/` directory created
   - Open http://localhost:4173
   - Test key features

### Step 2: Push to GitHub

1. **Initialize git in frontend:**
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend setup"
```

2. **Create GitHub repository:**
   - Go to github.com
   - Click "New" repository
   - Name: `ecommerce-frontend`
   - Create repository

3. **Push to GitHub:**
```bash
git branch -M main
git remote add origin https://github.com/yourusername/ecommerce-frontend.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to vercel.com**
   - Sign up or log in
   - Click "Add New..."
   - Select "Project"

2. **Import GitHub Repository**
   - Click "Import Git Repository"
   - Paste: `https://github.com/yourusername/ecommerce-frontend.git`
   - Click "Continue"

3. **Configure Project**
   - **Project Name:** ecommerce-frontend
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     - `VITE_API_URL`: `https://ecommerce-api.onrender.com/api`
     - `VITE_RAZORPAY_KEY`: (your Razorpay test/live key)

5. **Click "Deploy"**
   - Wait for deployment
   - Once complete, get URL: `https://ecommerce-frontend.vercel.app`

### Step 4: Test Frontend Deployment

1. **Open the deployed site**
2. **Test key features:**
   - [ ] Homepage loads
   - [ ] Products display
   - [ ] Can search/filter
   - [ ] Can login/register
   - [ ] Can add to cart
   - [ ] Can proceed to checkout
   - [ ] Payment gateway loads
   - [ ] Dark mode works
   - [ ] Responsive on mobile

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. **Go to mongodb.com/cloud/atlas**
2. **Sign up for free account**
3. **Verify email**
4. **Create organization and project**

### Step 2: Create Database Cluster

1. **In MongoDB Atlas Dashboard:**
   - Click "Build a Database"
   - Select "Free" tier (M0)

2. **Configure Cluster:**
   - **Cluster Name:** ecommerce
   - **Provider:** AWS
   - **Region:** Select closest to you
   - Click "Create Cluster"
   - Wait 5-10 minutes for cluster creation

### Step 3: Create Database User

1. **Go to "Database Access":**
   - Click "Add New Database User"
   - **Username:** ecommerce-user
   - **Password:** Generate strong password
   - Click "Add User"

2. **Note the credentials:**
   - Username: ecommerce-user
   - Password: (save securely)

### Step 4: Allow Network Access

1. **Go to "Network Access":**
   - Click "Add IP Address"
   - For development: Add your current IP
   - For production: Add `0.0.0.0` (allow all)
   - Click "Confirm"

### Step 5: Get Connection String

1. **Go to "Databases":**
   - Click "Connect" button
   - Choose "Drivers" → "Node.js"
   - Copy connection string

2. **Format:**
```
mongodb+srv://ecommerce-user:PASSWORD@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
```

3. **Replace:**
   - `PASSWORD` with actual password
   - `cluster0` with your cluster name

### Step 6: Set Up Database Indexes

1. **Use MongoDB Compass or Atlas UI:**

```javascript
// Products collection - text search index
db.products.createIndex({ 
  "title": "text", 
  "description": "text" 
})

// Products - category index
db.products.createIndex({ "category": 1 })

// Products - price index
db.products.createIndex({ "price": 1 })

// Orders - userId index
db.orders.createIndex({ "userId": 1 })

// Orders - createdAt index
db.orders.createIndex({ "createdAt": -1 })

// Users - email unique index
db.users.createIndex({ "email": 1 }, { unique: true })

// Reviews - productId index
db.reviews.createIndex({ "productId": 1, "createdAt": -1 })
```

### Step 7: Create Sample Data (Optional)

Connect with MongoDB Compass and insert sample products:

```javascript
db.products.insertMany([
  {
    title: "Sample Product 1",
    description: "High quality product",
    category: "Electronics",
    price: 2999,
    discountPrice: 2499,
    images: ["https://via.placeholder.com/400x400"],
    stock: 50,
    rating: 4.5,
    numRatings: 10,
    reviews: [],
    createdAt: new Date()
  },
  // Add more products...
])
```

---

## Payment Gateway Setup (Razorpay)

### Step 1: Create Razorpay Merchant Account

1. **Go to razorpay.com**
2. **Sign up for merchant account**
3. **Verify email and phone**
4. **Complete KYC (Know Your Customer)**

### Step 2: Get API Keys

1. **In Razorpay Dashboard:**
   - Go to Settings → API Keys
   - Copy **Key ID** (public key)
   - Copy **Key Secret** (private key, keep secure)

2. **Keys format:**
   - Test Keys: start with `rzp_test_`
   - Live Keys: start with `rzp_live_`

### Step 3: Set Payment Modes

1. **In Dashboard:**
   - Go to Settings → Payment Methods
   - Enable: Credit Cards, Debit Cards, UPI, Wallets
   - Configure accordingly

### Step 4: Add to Backend .env

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
```

### Step 5: Test Payment Flow

1. **Use test keys first**
2. **Test card:** `4111111111111111`
3. **Expiry:** Any future date
4. **CVV:** Any 3 digits
5. **Verify payment succeeds**

### Step 6: Activate Live Keys

1. **In Razorpay Dashboard:**
   - Complete all setup steps
   - Get merchant approval
   - Switch to Live Keys

2. **Update backend .env** with live keys

3. **Redeploy backend**

---

## Post-Deployment Configuration

### Step 1: Update CORS Settings

1. **In backend .env:**
```env
# Update to production frontend URL
FRONTEND_URL=https://ecommerce-frontend.vercel.app
```

2. **Redeploy backend on Render**

### Step 2: Configure Custom Domain (Optional)

**For Frontend (Vercel):**
1. In Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records at registrar
4. Wait for SSL certificate generation

**For Backend (Render):**
1. In Render Dashboard → Environment
2. Add custom domain
3. Update DNS CNAME record

### Step 3: Set Up Monitoring

**Monitor Backend:**
```bash
# Add to server.js
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date()
  })
})
```

**Set up uptime monitoring:**
- Use Uptime Robot (free)
- Monitor: https://ecommerce-api.onrender.com/api/health
- Alert if down for 5 minutes

### Step 4: Enable Analytics

**Frontend (Vercel):**
- Vercel automatically provides analytics
- View in: Project Settings → Analytics

**Backend (Render):**
- View in: Logs section
- Check CPU, Memory usage

### Step 5: Configure Email (Optional)

1. **Get Gmail App Password:**
   - Google Account Settings
   - Security → App Passwords
   - Generate password for Mail

2. **Update .env:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password
EMAIL_FROM=noreply@ecommerce.com
```

3. **Uncomment email sending code**

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Check uptime monitor
- [ ] Verify no critical errors in logs
- [ ] Check database backups completed
- [ ] Monitor response times

### Weekly Checks

- [ ] Review error logs
- [ ] Check disk space usage
- [ ] Verify backups
- [ ] Monitor payment success rate

### Monthly Checks

- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance analysis
- [ ] Database optimization
- [ ] Cost review

### Database Maintenance

**Enable automated backups (MongoDB Atlas):**
1. Go to Backup
2. Enable automated backups
3. Set retention to 7+ days
4. Test restore process

**Monitor database:**
```bash
# Connect and check stats
mongosh "mongodb+srv://user:pass@cluster.mongodb.net"
use ecommerce
db.stats()
db.products.countDocuments()
db.orders.countDocuments()
```

### Logs Monitoring

**Render Backend Logs:**
- Real-time in Render Dashboard
- Rotate logs daily
- Archive old logs

**Vercel Frontend Logs:**
- Check Function logs
- Check Edge Function logs
- Review Error logs

---

## Scaling & Performance

### Increase Backend Capacity (Render)

1. **Go to Instance Type:**
   - Starter: Free (limited)
   - Standard: $7/month
   - Pro: $24/month

2. **Upgrade:**
   - Better CPU/Memory
   - Auto-scaling available on paid plans

### Database Optimization

```javascript
// Add caching layer (Redis - optional)
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
app.get('/api/products/featured', async (req, res) => {
  const cached = await client.get('featured-products');
  if (cached) return res.json(JSON.parse(cached));
  
  const data = await Product.find().limit(6);
  await client.setex('featured-products', 3600, JSON.stringify(data));
  res.json(data);
});
```

### Frontend Optimization

- Image compression with Cloudinary
- Code splitting by route
- CSS minification (Vite auto)
- JavaScript minification (Vite auto)
- Gzip compression enabled

---

## Troubleshooting

### Deployment Failed

**Check:**
1. Build logs for errors
2. Environment variables complete
3. package.json has start script
4. No hardcoded localhost URLs
5. Dependencies specified correctly

**Solutions:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force

# Test build locally
npm run build
```

### API Timeout After Deployment

**Causes:**
- Database connection slow
- Unoptimized queries
- Cold start (Render free tier)

**Solutions:**
1. Add indexes to frequently queried fields
2. Upgrade to paid plan for faster startup
3. Implement caching
4. Optimize database queries

### CORS Errors in Production

**Solution:**
```env
# Update backend .env
FRONTEND_URL=https://your-frontend-domain.com
```

Then redeploy backend

### Payment Not Working

**Check:**
1. Razorpay keys correct
2. Using correct key type (test/live)
3. Amount greater than 0
4. Network access allowed
5. Callback URL configured

---

## Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] API working (test health endpoint)
- [ ] Database connected and accessible
- [ ] Razorpay integration working (test payment)
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] SSL certificates valid
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Error logs accessible
- [ ] Team can access dashboards
- [ ] Documentation updated
- [ ] Performance acceptable
- [ ] Security audit passed

---

## Useful Commands

```bash
# Test API endpoint
curl https://ecommerce-api.onrender.com/api/health

# View logs (Render)
# Use Render dashboard → Logs section

# Connect to MongoDB
mongodb+srv://user:pass@cluster.mongodb.net/ecommerce

# Check Node version
node --version

# Check npm version
npm --version

# View package vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **Razorpay Docs:** https://razorpay.com/docs
- **Node.js Docs:** https://nodejs.org/docs

---

**Deployment Completed!** 🎉

Your e-commerce application is now live:
- **Frontend:** https://ecommerce-frontend.vercel.app
- **Backend:** https://ecommerce-api.onrender.com
- **Database:** MongoDB Atlas

Start selling! 🚀
