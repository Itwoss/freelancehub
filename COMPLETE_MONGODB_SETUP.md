# 🍃 Complete MongoDB Setup for DigitalOcean

## 🎯 Your MongoDB Credentials:
- **Username**: `sanjay56`
- **Password**: `sanjay@123`
- **Cluster**: `freelancehub-admin.vmep9bd.mongodb.net`
- **Database**: `freelance_marketplace`

## 📋 Step-by-Step Setup:

### **Step 1: Configure MongoDB Atlas Network Access**

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com
   - Login with your credentials

2. **Network Access Setup**
   - Go to **"Network Access"** in the left sidebar
   - Click **"Add IP Address"**
   - Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**

### **Step 2: Configure DigitalOcean Environment Variables**

1. **Go to DigitalOcean Dashboard**
   - Visit: https://cloud.digitalocean.com
   - Go to **Apps** → **urchin-app-olxze**
   - Click **Settings** → **App-Level Environment Variables**

2. **Add These Environment Variables:**

```bash
MONGODB_URI=mongodb+srv://sanjay56:sanjay@123@freelancehub-admin.vmep9bd.mongodb.net/freelance_marketplace?retryWrites=true&w=majority&appName=freelancehub-admin
NEXTAUTH_URL=https://urchin-app-olxze.ondigitalocean.app
NEXTAUTH_SECRET=kUcRVj79FE3OakOWFMk02c8FQXduETlgtXUq8AAHT3k=
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RPjP2rRnGLu4yD
RAZORPAY_KEY_SECRET=ddorF1ExMdUIXbWwDsxvhwkV
RAZORPAY_ENVIRONMENT=production
NEXT_PUBLIC_BASE_URL=https://urchin-app-olxze.ondigitalocean.app
NEXT_PUBLIC_APP_URL=https://urchin-app-olxze.ondigitalocean.app
NODE_ENV=production
```

### **Step 3: Update Build Configuration**

1. **In DigitalOcean App Settings:**
   - **Build Command**: `npm run build:mongodb`
   - **Start Command**: `npm start`

### **Step 4: Deploy Your App**

1. **Click "Deploy" or "Redeploy"**
2. **Wait for deployment to complete**

### **Step 5: Test Your Setup**

**Test URLs:**
- **MongoDB Test**: https://urchin-app-olxze.ondigitalocean.app/api/test-mongodb
- **Login Test**: https://urchin-app-olxze.ondigitalocean.app/auth/signin
- **Register Test**: https://urchin-app-olxze.ondigitalocean.app/auth/signup

**Expected Results:**
```json
{
  "success": true,
  "message": "MongoDB connection successful",
  "userCount": 0,
  "database": "MongoDB"
}
```

## 🔧 **Troubleshooting:**

### **If you get "Database not configured":**
1. Check if `MONGODB_URI` is set in DigitalOcean
2. Verify MongoDB Atlas network access
3. Check DigitalOcean app logs

### **If you get network errors:**
1. Ensure MongoDB Atlas allows access from anywhere (0.0.0.0/0)
2. Check if your MongoDB cluster is running
3. Verify your credentials are correct

### **If login still fails:**
1. Check DigitalOcean app logs
2. Test the `/api/test-mongodb` endpoint
3. Verify all environment variables are set

## 🎉 **Success Indicators:**

✅ **MongoDB Test Endpoint** returns success  
✅ **Login Page** loads without errors  
✅ **Registration** works  
✅ **No "Database not configured" errors**

---

## 📞 **Quick Reference:**

**Your MongoDB Connection String:**
```
mongodb+srv://sanjay56:sanjay@123@freelancehub-admin.vmep9bd.mongodb.net/freelance_marketplace?retryWrites=true&w=majority&appName=freelancehub-admin
```

**DigitalOcean Build Command:**
```
npm run build:mongodb
```

**Test Endpoint:**
```
https://urchin-app-olxze.ondigitalocean.app/api/test-mongodb
```

**Login Test:**
```
https://urchin-app-olxze.ondigitalocean.app/auth/signin
```
