# E-Commerce Application - Setup & Deployment Guide

## Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Razorpay merchant account
- Git

---

## Part 1: Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Fill in your environment variables:**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=another_super_secret_refresh_token_key
REFRESH_TOKEN_EXPIRE=30d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM=noreply@ecommerce.com

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

5. **Start the backend server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **In a new terminal, navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Update environment variables:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_your_key_id
```

5. **Start development server:**
```bash
npm run dev
```

Application will run on `http://localhost:5173`

---

## Part 2: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create a Project**
   - Click "New Project"
   - Enter project name: "ecommerce"
   - Click "Create Project"

3. **Create a Cluster**
   - Click "Build a Database"
   - Select "Free" tier (M0)
   - Select region close to you
   - Click "Create Cluster"

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Enter username and password
   - Click "Add User"

5. **Get Connection String**
   - Go to "Databases"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `ecommerce`

6. **Test Connection**
   - Update `MONGODB_URI` in backend `.env`
   - Start backend server and check console for connection message

---

## Part 3: Razorpay Setup

1. **Create Razorpay Account**
   - Go to [razorpay.com](https://razorpay.com)
   - Sign up for merchant account

2. **Get API Keys**
   - Go to Settings → API Keys
   - Get "Key ID" and "Key Secret"
   - Copy to `.env` files

3. **Test Webhook (Optional)**
   - Settings → Webhooks
   - Add test webhook URL

---

## Part 4: Deployment

### Deploy Backend to Render

1. **Prepare Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ecommerce.git
git push -u origin main
```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Choose backend directory
   - Settings:
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Environment:** Node
     - **Node Version:** 18

4. **Add Environment Variables**
   - Go to Environment
   - Add all variables from `.env.example`
   - Use MongoDB Atlas URI, Razorpay keys, etc.

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Get your backend URL: `https://ecommerce-api.onrender.com`

### Deploy Frontend to Vercel

1. **Push Frontend to GitHub**
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ecommerce-frontend.git
git push -u origin main
```

2. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Enter GitHub repository URL
   - Click "Import"

3. **Configure Project**
   - Project Name: ecommerce-frontend
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://ecommerce-api.onrender.com/api
     VITE_RAZORPAY_KEY=your_razorpay_key
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment

6. **Update Backend CORS**
   - Add Vercel URL to `FRONTEND_URL` in backend environment variables
   - Redeploy backend

---

## Part 5: Production Checklist

### Security
- [ ] Update all passwords and keys
- [ ] Enable HTTPS (automatic on Vercel and Render)
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set secure cookies (httpOnly, Secure, SameSite)
- [ ] Remove console.logs
- [ ] Enable monitoring and logging

### Database
- [ ] Enable MongoDB backups
- [ ] Create database indexes
- [ ] Set up database user with minimal permissions
- [ ] Enable encryption at rest
- [ ] Configure IP whitelist

### Frontend
- [ ] Update API URL to production backend
- [ ] Enable minification and compression
- [ ] Set up CDN for static assets
- [ ] Configure analytics
- [ ] Set up error tracking (Sentry)

### Backend
- [ ] Enable request logging
- [ ] Set up error tracking
- [ ] Configure email service
- [ ] Enable rate limiting
- [ ] Set appropriate cache headers
- [ ] Monitor server performance

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure alert notifications
- [ ] Set up performance monitoring
- [ ] Monitor error rates
- [ ] Track user metrics

---

## Part 6: Troubleshooting

### Common Issues

**Backend Connection Error**
```
Error: ECONNREFUSED 127.0.0.1:5000
```
- Ensure backend server is running
- Check if port 5000 is available
- Check firewall settings

**MongoDB Connection Error**
```
Error: Cannot connect to MongoDB
```
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user exists
- Check username and password

**CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
- Update `FRONTEND_URL` in backend `.env`
- Restart backend server
- Clear browser cache

**Razorpay Error**
```
Razorpay: Invalid key_id or key_secret
```
- Verify keys are correct
- Use test keys for development
- Check for extra spaces in `.env`

**Build Error**
```
npm ERR! Cannot find module
```
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Clear npm cache: `npm cache clean --force`

---

## Part 7: Environment Variables Reference

### Backend .env
```env
# Database
MONGODB_URI=<your_mongodb_uri>

# Server
PORT=5000
NODE_ENV=development|production

# Authentication
JWT_SECRET=<random_secret>
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=<random_secret>
REFRESH_TOKEN_EXPIRE=30d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your_email>
SMTP_PASS=<app_password>
EMAIL_FROM=noreply@ecommerce.com

# Payment
RAZORPAY_KEY_ID=<your_key>
RAZORPAY_KEY_SECRET=<your_secret>

# Frontend
FRONTEND_URL=http://localhost:5173|https://yourdomain.com
```

### Frontend .env
```env
VITE_API_URL=http://localhost:5000/api|https://api.yourdomain.com/api
VITE_RAZORPAY_KEY=<your_public_key>
VITE_NODE_ENV=development|production
```

---

## Part 8: Scripts Reference

### Backend Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (if configured)
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run eslint (if configured)
```

---

## Part 9: Getting Help

### Resources
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Razorpay Integration Guide](https://razorpay.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

### Support Channels
- GitHub Issues
- Email: support@ecommerce.com
- Discord Community

---

## Congratulations! 🎉

Your e-commerce application is now deployed and ready to use!

**Frontend:** https://yourdomain.vercel.app
**Backend:** https://ecommerce-api.onrender.com
**Database:** MongoDB Atlas

Start selling! 🚀
