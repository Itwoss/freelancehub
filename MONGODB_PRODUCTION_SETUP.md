# 🍃 MongoDB Production Setup for DigitalOcean

## 🔧 Fix "Database not configured" Error with MongoDB

### **Step 1: Get Your MongoDB Connection String**

**If you have MongoDB Atlas:**
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/freelance_marketplace?retryWrites=true&w=majority
   ```

**If you have MongoDB on DigitalOcean:**
1. Go to DigitalOcean Dashboard
2. Find your MongoDB database
3. Copy the connection string

### **Step 2: Configure Environment Variables in DigitalOcean**

**In DigitalOcean App Platform:**

1. **Go to your app**: `urchin-app-olxze`
2. **Settings** → **App-Level Environment Variables**
3. **Add these variables:**

```bash
# MongoDB Configuration
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/freelance_marketplace?retryWrites=true&w=majority"

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
   npm run build:mongodb
   ```

3. **Update Start Command:**
   ```bash
   npm start
   ```

### **Step 4: Deploy MongoDB Schema**

**After setting environment variables:**

1. **SSH into your app** (if possible) or use DigitalOcean console
2. **Run MongoDB setup:**
   ```bash
   npm run setup:mongodb
   ```

### **Step 5: Test the Fix**

**Test URLs:**
- **Home**: https://urchin-app-olxze.ondigitalocean.app
- **Login**: https://urchin-app-olxze.ondigitalocean.app/auth/signin
- **Register**: https://urchin-app-olxze.ondigitalocean.app/auth/signup
- **API Test**: https://urchin-app-olxze.ondigitalocean.app/api/test-db

### **🔍 Troubleshooting**

**If you still get "Database not configured":**

1. **Check MongoDB Connection**
   - Ensure `MONGODB_URI` is set correctly
   - Verify connection string format
   - Check if MongoDB cluster is running

2. **Check Environment Variables**
   - Ensure all variables are set in DigitalOcean
   - Verify no typos in variable names

3. **Check App Logs**
   - Go to DigitalOcean App Platform
   - Check **Runtime Logs** for MongoDB connection errors

4. **Test MongoDB Connection**
   ```bash
   # Test if MongoDB is accessible
   curl https://urchin-app-olxze.ondigitalocean.app/api/test-db
   ```

### **📊 Expected Results**

**After setup, you should see:**
- ✅ Login working without 500 errors
- ✅ Registration working
- ✅ MongoDB connection successful
- ✅ User authentication working

### **🔐 Security Notes**

- Use strong passwords for MongoDB
- Keep `NEXTAUTH_SECRET` secure
- Use production Razorpay keys
- Enable MongoDB SSL connections
- Whitelist DigitalOcean IPs in MongoDB Atlas

### **📞 Support**

If you need help:
1. Check DigitalOcean App Platform logs
2. Verify MongoDB connection string
3. Test database connection separately
4. Check MongoDB Atlas network access settings

---

**🎉 Once completed, your login should work perfectly with MongoDB!**
