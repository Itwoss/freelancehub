# 🚀 DigitalOcean Production Setup Guide

## 🔧 Fix "Database not configured" Error

### **Step 1: Create PostgreSQL Database**

1. **Go to DigitalOcean Dashboard**
   - Visit: https://cloud.digitalocean.com
   - Click **"Create"** → **"Database"**

2. **Configure Database**
   - **Engine**: PostgreSQL
   - **Plan**: Basic ($15/month)
   - **Region**: Same as your app
   - **Database Name**: `freelance_marketplace`
   - **Username**: `freelance_user`
   - **Password**: Generate strong password

3. **Get Connection String**
   ```
   postgresql://freelance_user:password@host:port/freelance_marketplace
   ```

### **Step 2: Configure Environment Variables**

**In DigitalOcean App Platform:**

1. **Go to your app**: `urchin-app-olxze`
2. **Settings** → **App-Level Environment Variables**
3. **Add these variables:**

```bash
# Database Configuration
DATABASE_URL="postgresql://freelance_user:YOUR_PASSWORD@YOUR_HOST:5432/freelance_marketplace"

# NextAuth Configuration
NEXTAUTH_URL="https://urchin-app-olxze.ondigitalocean.app"
NEXTAUTH_SECRET="kUcRVj79FE3OakOWFMk02c8FQXduETlgtXUq8AAHT3k="

# Razorpay Configuration (Your Live Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_RPjP2rRnGLu4yD"
RAZORPAY_KEY_SECRET="ddorF1ExMdUIXbWwDsxvhwkV"
RAZORPAY_ENVIRONMENT="production"
NEXT_PUBLIC_BASE_URL="https://urchin-app-olxze.ondigitalocean.app"

# App Configuration
NEXT_PUBLIC_APP_URL="https://urchin-app-olxze.ondigitalocean.app"
NODE_ENV="production"
```

### **Step 3: Update App Configuration**

**In DigitalOcean App Platform:**

1. **Go to your app settings**
2. **Update Build Command:**
   ```bash
   npm run build:production
   ```

3. **Update Start Command:**
   ```bash
   npm start
   ```

### **Step 4: Deploy Database Schema**

**After setting environment variables:**

1. **SSH into your app** (if possible) or use DigitalOcean console
2. **Run migration:**
   ```bash
   npm run setup:production
   ```

### **Step 5: Test the Fix**

**Test URLs:**
- **Home**: https://urchin-app-olxze.ondigitalocean.app
- **Login**: https://urchin-app-olxze.ondigitalocean.app/auth/signin
- **Register**: https://urchin-app-olxze.ondigitalocean.app/auth/signup
- **API Test**: https://urchin-app-olxze.ondigitalocean.app/api/test-db

### **🔍 Troubleshooting**

**If you still get "Database not configured":**

1. **Check Environment Variables**
   - Ensure `DATABASE_URL` is set correctly
   - Verify database connection string format

2. **Check Database Status**
   - Ensure PostgreSQL database is running
   - Verify connection from DigitalOcean

3. **Check App Logs**
   - Go to DigitalOcean App Platform
   - Check **Runtime Logs** for errors

4. **Test Database Connection**
   ```bash
   # Test if database is accessible
   curl https://urchin-app-olxze.ondigitalocean.app/api/test-db
   ```

### **📊 Expected Results**

**After setup, you should see:**
- ✅ Login working without 500 errors
- ✅ Registration working
- ✅ Database connection successful
- ✅ User authentication working

### **🔐 Security Notes**

- Use strong passwords for database
- Keep `NEXTAUTH_SECRET` secure
- Use production Razorpay keys
- Enable database SSL connections

### **📞 Support**

If you need help:
1. Check DigitalOcean App Platform logs
2. Verify all environment variables are set
3. Test database connection separately
4. Contact DigitalOcean support if needed

---

**🎉 Once completed, your login should work perfectly on production!**
