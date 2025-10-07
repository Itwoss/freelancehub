# 🔧 DigitalOcean Environment Variables Setup

## Copy these EXACT values to your DigitalOcean App Platform:

### **Step 1: Go to DigitalOcean Dashboard**
1. Visit: https://cloud.digitalocean.com
2. Go to **Apps** → **urchin-app-olxze**
3. Click **Settings** → **App-Level Environment Variables**

### **Step 2: Add These Environment Variables**

```bash
# MongoDB Configuration (YOUR ACTUAL CREDENTIALS)
MONGODB_URI=mongodb+srv://sanjay56:sanjay@123@freelancehub-admin.vmep9bd.mongodb.net/freelance_marketplace?retryWrites=true&w=majority&appName=freelancehub-admin

# NextAuth Configuration
NEXTAUTH_URL=https://urchin-app-olxze.ondigitalocean.app
NEXTAUTH_SECRET=kUcRVj79FE3OakOWFMk02c8FQXduETlgtXUq8AAHT3k=

# Razorpay Configuration (Your Live Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RPjP2rRnGLu4yD
RAZORPAY_KEY_SECRET=ddorF1ExMdUIXbWwDsxvhwkV
RAZORPAY_ENVIRONMENT=production
NEXT_PUBLIC_BASE_URL=https://urchin-app-olxze.ondigitalocean.app

# App Configuration
NEXT_PUBLIC_APP_URL=https://urchin-app-olxze.ondigitalocean.app
NODE_ENV=production
```

### **Step 3: Update Build Command**
In your DigitalOcean app settings:
- **Build Command**: `npm run build:mongodb`
- **Start Command**: `npm start`

### **Step 4: Deploy**
Click **"Deploy"** or **"Redeploy"** your app

### **Step 5: Test**
Visit: https://urchin-app-olxze.ondigitalocean.app/api/test-mongodb

**Expected Result:**
```json
{
  "success": true,
  "message": "MongoDB connection successful",
  "userCount": 0,
  "database": "MongoDB"
}
```

---

## 🎯 **Quick Copy-Paste Commands:**

### **For DigitalOcean Environment Variables:**
```
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

### **Build Command:**
```
npm run build:mongodb
```

### **Start Command:**
```
npm start
```
