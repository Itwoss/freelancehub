# 🚨 URGENT: Production Database Fix

## ❌ Current Problem
Your live site is using the **SQLite schema** instead of the **MongoDB schema**, causing this error:
```
Error validating datasource `db`: the URL must start with the protocol `file:`.
```

## ✅ Solution Steps

### **Step 1: Update DigitalOcean Build Command**

**In DigitalOcean App Platform:**

1. Go to your app: `urchin-app-olxze`
2. Go to **Settings** → **App-Level Settings**
3. Update **Build Command** to:
   ```bash
   npm run build:mongodb
   ```

### **Step 2: Set Environment Variables**

**In DigitalOcean App Platform:**

1. Go to **Settings** → **App-Level Environment Variables**
2. **Add/Update these variables:**

```bash
# MongoDB Configuration (REQUIRED)
MONGODB_URI="mongodb+srv://sanjay56:sanjay@123@freelancehub-admin.vmep9bd.mongodb.net/freelance_marketplace?retryWrites=true&w=majority&appName=freelancehub-admin"

# NextAuth Configuration
NEXTAUTH_URL="https://urchin-app-olxze.ondigitalocean.app"
NEXTAUTH_SECRET="kUcRVj79FE3OakOWFMk02c8FQXduETlgtXUq8AAHT3k="

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_RPjP2rRnGLu4yD"
RAZORPAY_KEY_SECRET="ddorF1ExMdUIXbWwDsxvhwkV"
RAZORPAY_ENVIRONMENT="production"
NEXT_PUBLIC_BASE_URL="https://urchin-app-olxze.ondigitalocean.app"

# App Configuration
NEXT_PUBLIC_APP_URL="https://urchin-app-olxze.ondigitalocean.app"
NODE_ENV="production"
```

### **Step 3: Deploy the Fix**

**After updating the build command and environment variables:**

1. **Trigger a new deployment** in DigitalOcean
2. **Wait for build to complete**
3. **Test your login page**

### **Step 4: Test the Fix**

**Test these URLs:**
- **Home**: https://urchin-app-olxze.ondigitalocean.app
- **Login**: https://urchin-app-olxze.ondigitalocean.app/auth/signin
- **Register**: https://urchin-app-olxze.ondigitalocean.app/auth/signup

## 🔍 What Was Wrong?

1. **Wrong Schema**: Your app was using `schema.prisma` (SQLite) instead of `schema-mongodb.prisma`
2. **Wrong Build Command**: DigitalOcean was using the default build command
3. **Missing Environment Variables**: MongoDB connection string wasn't set

## ✅ What I Fixed

1. **Updated package.json**: Changed default build command to use MongoDB schema
2. **Updated DigitalOcean build**: Now uses `npm run build:mongodb`
3. **Provided correct environment variables**: MongoDB connection string and all required variables

## 🚀 Expected Results

**After deployment, you should see:**
- ✅ Login page loads without errors
- ✅ Registration works
- ✅ Database connection successful
- ✅ No more "file: protocol" errors

## 📞 If Still Not Working

1. **Check DigitalOcean Logs**:
   - Go to your app in DigitalOcean
   - Check **Runtime Logs** for any errors

2. **Verify Environment Variables**:
   - Make sure `MONGODB_URI` is set correctly
   - Check for typos in variable names

3. **Test Database Connection**:
   ```bash
   curl https://urchin-app-olxze.ondigitalocean.app/api/test-mongodb
   ```

---

**🎉 This should fix your login error completely!**
