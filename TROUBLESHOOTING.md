# E-Commerce Application - Troubleshooting Guide

## Common Issues & Solutions

---

## Backend Issues

### 1. MongoDB Connection Error
**Error Message:**
```
MongoError: connect ECONNREFUSED 127.0.0.1:27017
or
Error: Cannot connect to MongoDB Atlas
```

**Solutions:**

**If using MongoDB Atlas:**
1. Check connection string in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

2. Verify credentials are correct (especially password)

3. Add IP address to MongoDB Atlas whitelist:
   - Go to MongoDB Atlas → Network Access
   - Add your IP or allow all (0.0.0.0)

4. Check cluster is running:
   - Go to Clusters
   - Verify cluster status is "Ready"

5. Test connection string:
   ```bash
   mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
   ```

6. Update database name if not "ecommerce"

**If using local MongoDB:**
1. Start MongoDB service:
   ```bash
   # Mac
   brew services start mongodb-community
   
   # Windows (if installed)
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```

2. Verify MongoDB is running:
   ```bash
   mongosh --eval "db.adminCommand('ping')"
   ```

3. Use local URI:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

---

### 2. Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Find and kill process on port 5000:**

```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

**Or use a different port:**
```bash
PORT=5001 npm run dev
```

---

### 3. JWT Secret Not Set

**Error Message:**
```
Error: JWT_SECRET is not defined
or
Cannot read properties of undefined (reading 'sign')
```

**Solutions:**

1. Check `.env` file has JWT_SECRET:
   ```env
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRE=30d
   ```

2. Restart server after updating `.env`

3. Verify env file is in backend root directory

4. Don't use weak secrets - use random string:
   ```bash
   # Generate strong secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

### 4. CORS Error

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. Update `.env` with correct frontend URL:
   ```env
   # Development
   FRONTEND_URL=http://localhost:5173
   
   # Production
   FRONTEND_URL=https://yourdomain.com
   ```

2. Restart backend server

3. Check CORS middleware in `server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

4. Clear browser cache and restart dev server

---

### 5. Razorpay Error

**Error Message:**
```
Error: Razorpay: Invalid key_id or key_secret
```

**Solutions:**

1. Verify Razorpay keys in `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=xxx
   ```

2. Get correct keys from Razorpay Dashboard:
   - Settings → API Keys
   - Copy KEY_ID and KEY_SECRET

3. For testing, use test keys (start with `rzp_test_`)

4. Restart backend after updating keys

5. Check for extra spaces in `.env`:
   ```env
   # Wrong - extra spaces
   RAZORPAY_KEY_ID = rzp_test_xxx
   
   # Correct - no spaces
   RAZORPAY_KEY_ID=rzp_test_xxx
   ```

---

### 6. Missing Dependencies

**Error Message:**
```
Cannot find module 'express'
or
Module not found: Can't resolve 'bcryptjs'
```

**Solutions:**

1. Install all dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Check `package.json` has all dependencies

---

### 7. Validation Error

**Error Message:**
```
Error: validation failed or Validation errors
```

**Solutions:**

1. Check request body matches schema:
   - For registration: `name`, `email`, `password`, `phone`
   - For products: `title`, `description`, `category`, `price`, `stock`

2. Verify data types are correct

3. Check required fields are provided

4. Validate email format for email fields

---

### 8. Authentication Token Expired

**Error Message:**
```
Error: Token expired or Invalid token
```

**Solutions:**

1. Clear localStorage and login again:
   ```javascript
   localStorage.clear()
   ```

2. Check token expiry in `.env`:
   ```env
   JWT_EXPIRE=7d
   ```

3. Verify token format includes "Bearer ":
   ```
   Authorization: Bearer <token>
   ```

4. Check token not corrupted by copying manually

---

### 9. Cannot POST to Payment Endpoint

**Error Message:**
```
404 POST /api/orders/razorpay/create-order
```

**Solutions:**

1. Verify route is defined in `backend/routes/orderRoutes.js`

2. Check route file is imported in `server.js`

3. Verify request URL matches route:
   ```javascript
   // Correct
   POST http://localhost:5000/api/orders/razorpay/create-order
   
   // Check frontend calls correct URL
   api.post('/orders/razorpay/create-order', data)
   ```

4. Check controller method exists

---

## Frontend Issues

### 10. API Not Connecting

**Error Message:**
```
ERR_FAILED or Network Error: Cannot reach API
```

**Solutions:**

1. Check `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. Restart frontend dev server:
   ```bash
   npm run dev
   ```

3. Verify backend is running:
   ```bash
   curl http://localhost:5000/api/health
   ```

4. Check firewall allows connection

5. Clear browser cache (Ctrl+Shift+Delete)

---

### 11. Dark Mode Not Working

**Error Message:**
- Dark mode toggle doesn't work
- Colors don't change

**Solutions:**

1. Check `useDarkMode` hook is used in components:
   ```javascript
   const { darkMode, toggleDarkMode } = useDarkMode();
   ```

2. Verify Tailwind dark mode in `tailwind.config.js`:
   ```javascript
   darkMode: 'class'
   ```

3. Check localStorage for darkMode key:
   ```javascript
   localStorage.getItem('darkMode')
   ```

4. Force refresh with Ctrl+F5

---

### 12. Images Not Loading

**Error Message:**
```
Failed to load image or Image 404
```

**Solutions:**

1. Check image URLs are correct

2. For development, verify Cloudinary paths

3. For test data, add sample image URLs:
   ```
   https://via.placeholder.com/400x300
   ```

4. Check image server/CDN is accessible

5. Verify image extensions are correct (.jpg, .png)

---

### 13. Cart Not Persisting

**Error Message:**
- Cart empties on page refresh
- Items disappear

**Solutions:**

1. Check browser allows localStorage:
   ```javascript
   localStorage.setItem('test', 'test')
   ```

2. Disable browser privacy/incognito mode

3. Increase localStorage limit

4. Clear localStorage and sync with backend:
   ```javascript
   localStorage.clear()
   ```

5. Verify CartContext fetchCart() called on mount

---

### 14. Form Validation Not Working

**Error Message:**
- Form submits with empty fields
- Invalid emails accepted

**Solutions:**

1. Check React Hook Form is imported:
   ```javascript
   import { useForm } from 'react-hook-form'
   ```

2. Verify validation rules in form:
   ```javascript
   register('email', { 
     required: 'Email is required',
     pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }
   })
   ```

3. Check error messages display:
   ```javascript
   {errors.email && <span>{errors.email.message}</span>}
   ```

4. Look for JavaScript console errors (F12)

---

### 15. Razorpay Popup Not Opening

**Error Message:**
```
Razorpay is not defined or Cannot read properties of undefined
```

**Solutions:**

1. Check Razorpay script loaded in `index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

2. Verify VITE_RAZORPAY_KEY in `.env`:
   ```env
   VITE_RAZORPAY_KEY=rzp_test_xxx
   ```

3. Check key is imported in Checkout component:
   ```javascript
   const key = import.meta.env.VITE_RAZORPAY_KEY
   ```

4. Verify payment amount > 0

5. Check backend returns orderId before opening popup

---

### 16. Router Navigation Not Working

**Error Message:**
```
Cannot navigate or Blank page after navigation
```

**Solutions:**

1. Check `useNavigate` is imported:
   ```javascript
   import { useNavigate } from 'react-router-dom'
   const navigate = useNavigate()
   ```

2. Verify route exists in `App.jsx`

3. Use correct path format:
   ```javascript
   navigate('/products')  // Correct
   navigate('products')   // Wrong
   ```

4. Check no console errors preventing navigation

5. Verify BrowserRouter wraps entire app

---

### 17. Conditional Rendering Issues

**Error Message:**
- Pages show when they shouldn't
- ProtectedRoute not working

**Solutions:**

1. Check auth state loaded:
   ```javascript
   if (loading) return <Spinner />
   ```

2. Verify useAuth hook:
   ```javascript
   const { user, loading } = useAuth()
   ```

3. Check ProtectedRoute logic:
   ```javascript
   return token ? <Component /> : <Navigate to="/login" />
   ```

4. Clear localStorage if stuck in loading state

---

### 18. Console Warnings/Errors

**Common Warnings:**
```
Warning: Each child should have a unique key prop
Warning: Cannot update a component while rendering
```

**Solutions:**

1. **Missing Key in Lists:**
   ```javascript
   // Wrong
   {items.map((item) => <div>{item}</div>)}
   
   // Correct
   {items.map((item) => <div key={item.id}>{item}</div>)}
   ```

2. **State Update in Render:**
   - Move setState to useEffect
   - Don't call setState during render

3. **Memory Leaks:**
   - Cancel API requests on unmount
   - Clear timers in cleanup function

---

### 19. Build Errors

**Error Message:**
```
npm ERR! npm run build failed
or
Vite build error
```

**Solutions:**

1. Check no TypeScript errors (if using TS)

2. Verify all imports are correct

3. Check no console.error() in code

4. Test in development first:
   ```bash
   npm run dev
   ```

5. Check build output:
   ```bash
   npm run build
   ls -la dist/
   ```

---

### 20. Styling Issues

**Problem:** Tailwind classes not applying

**Solutions:**

1. Check Tailwind CSS installed:
   ```bash
   npm list tailwindcss
   ```

2. Verify `index.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. Check `tailwind.config.js` includes content paths:
   ```javascript
   content: [
     "./src/**/*.{js,jsx}",
   ],
   ```

4. Restart dev server

5. Hard refresh browser (Ctrl+Shift+R)

---

## Deployment Issues

### 21. Vercel Deployment Failed

**Error Message:**
```
Build failed or Deployment error
```

**Solutions:**

1. Check build command:
   ```json
   "build": "vite build"
   ```

2. Verify environment variables set in Vercel:
   - VITE_API_URL
   - VITE_RAZORPAY_KEY

3. Check output directory is `dist`

4. Look at Vercel build logs for details

5. Test build locally:
   ```bash
   npm run build
   npm run preview
   ```

---

### 22. Render Deployment Failed

**Error Message:**
```
Build failed or Port not available
```

**Solutions:**

1. Check `package.json` start script:
   ```json
   "start": "node server.js"
   ```

2. Verify port is 5000 or use process.env.PORT

3. Add all environment variables in Render dashboard

4. Check Node.js version matches (18.x)

5. View Render logs for detailed errors

---

### 23. CORS Error in Production

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. Update backend .env:
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

2. Redeploy backend

3. Update frontend .env:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```

4. Redeploy frontend

5. Wait for cache to clear (5-10 minutes)

---

### 24. Environment Variables Not Loaded

**Error Message:**
```
Cannot read properties of undefined or process.env.VAR is undefined
```

**Solutions:**

1. Check variables set in deployment platform:
   - Vercel: Settings → Environment Variables
   - Render: Environment

2. Verify variable names match `.env.example`

3. For frontend, use VITE_ prefix:
   ```env
   VITE_API_URL=...
   ```

4. For backend, no prefix needed:
   ```env
   PORT=5000
   ```

5. Redeploy after adding variables

---

## Performance Issues

### 25. Slow Page Load

**Symptoms:**
- Pages take 3+ seconds to load
- Animations lag
- Components render slowly

**Solutions:**

1. Check network (F12 → Network tab):
   - API calls taking too long?
   - Images too large?
   - Too many requests?

2. Optimize images:
   - Use smaller dimensions
   - Compress images
   - Use WebP format

3. Code split routes:
   ```javascript
   const Products = lazy(() => import('./pages/Products'))
   ```

4. Lazy load images:
   ```html
   <img loading="lazy" src="..." />
   ```

5. Check database indexes for slow queries

---

### 26. High Memory Usage

**Symptoms:**
- App crashes or becomes unresponsive
- Browser tab becomes slow

**Solutions:**

1. Check for memory leaks:
   - Uncancelled API requests
   - Event listeners not removed
   - Timers not cleared

2. Clean up in useEffect:
   ```javascript
   useEffect(() => {
     return () => {
       // Cleanup code
     }
   }, [])
   ```

3. Limit re-renders with React.memo()

4. Use pagination for large lists

---

## Getting Help

### Where to Get Support

1. **GitHub Issues**
   - Check if issue already reported
   - Provide environment details
   - Include error message and steps

2. **Discord Community**
   - Ask in #help channel
   - Share error details
   - Be specific about problem

3. **Email Support**
   - Send to: support@ecommerce.com
   - Include reproduction steps
   - Attach relevant code/logs

4. **Stack Overflow**
   - Tag: [node.js], [react], [mongodb]
   - Include minimal reproducible example

---

## Emergency Quick Fix Checklist

If nothing works:

- [ ] Clear browser cache: `Ctrl+Shift+Delete`
- [ ] Hard refresh: `Ctrl+Shift+R`
- [ ] Restart dev servers: Stop and `npm run dev`
- [ ] Check network tab for actual errors
- [ ] Look at browser console (F12)
- [ ] Check backend logs in terminal
- [ ] Delete node_modules and `npm install`
- [ ] Clear browser localStorage: `localStorage.clear()`
- [ ] Try incognito/private mode
- [ ] Disable browser extensions
- [ ] Try different browser
- [ ] Check internet connection
- [ ] Verify firewall/VPN not blocking

---

## Still Need Help?

**Provide this information:**
1. Operating System (Windows/Mac/Linux)
2. Node.js version: `node --version`
3. npm version: `npm --version`
4. Full error message (copy from console)
5. Steps to reproduce
6. Screenshot/screencast
7. Browser being used
8. What you tried to fix it

---

**Last Updated:** 2024
**Version:** 1.0
**Maintained By:** DevOps Team
