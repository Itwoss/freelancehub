# 🚀 Production Deployment Setup Guide

## DigitalOcean App Platform Environment Variables

Add these environment variables to your DigitalOcean App Platform:

### **Required Environment Variables:**

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@your-db-host:5432/freelance_marketplace"

# NextAuth Configuration
NEXTAUTH_URL="https://urchin-app-olxze.ondigitalocean.app"
NEXTAUTH_SECRET="your-production-secret-key-here-make-it-long-and-random"

# Razorpay Configuration (Your Live Credentials)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_RPjP2rRnGLu4yD"
RAZORPAY_KEY_SECRET="ddorF1ExMdUIXbWwDsxvhwkV"
RAZORPAY_ENVIRONMENT="production"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
NEXT_PUBLIC_BASE_URL="https://urchin-app-olxze.ondigitalocean.app"

# App Configuration
NEXT_PUBLIC_APP_URL="https://urchin-app-olxze.ondigitalocean.app"
NODE_ENV="production"

# Email Configuration (Optional)
EMAIL_USER="your-production-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="FreelanceHub <noreply@freelancehub.com>"
```

## 🔧 **Steps to Fix Production Issues:**

### **1. Add Environment Variables in DigitalOcean:**

1. Go to your DigitalOcean App Platform dashboard
2. Select your app: `urchin-app-olxze`
3. Go to **Settings** → **App-Level Environment Variables**
4. Add each variable above with the correct values

### **2. Database Setup:**

**Option A: Use DigitalOcean Managed Database**
```bash
# Create a PostgreSQL database in DigitalOcean
# Get the connection string and use it as DATABASE_URL
```

**Option B: Use External Database (Supabase, PlanetScale, etc.)**
```bash
# Use your external database connection string
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

### **3. Generate Strong NEXTAUTH_SECRET:**

```bash
# Generate a strong secret key
openssl rand -base64 32
```

### **4. Update Razorpay Webhook URL:**

In your Razorpay dashboard:
- Webhook URL: `https://urchin-app-olxze.ondigitalocean.app/api/payment/razorpay/webhook`
- Events: `payment.captured`, `payment.failed`, `order.paid`

## 🐛 **Common Production Issues:**

### **Issue 1: Database Connection**
- **Error:** `Database not configured`
- **Solution:** Set correct `DATABASE_URL` in environment variables

### **Issue 2: JWT Secret Missing**
- **Error:** `JWT_SESSION_ERROR`
- **Solution:** Set strong `NEXTAUTH_SECRET` in environment variables

### **Issue 3: CORS Issues**
- **Error:** `CORS policy` errors
- **Solution:** Set correct `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL`

### **Issue 4: Razorpay Integration**
- **Error:** `create-order 400`
- **Solution:** Set correct Razorpay credentials and webhook URL

## 🔍 **Debugging Steps:**

### **1. Check Environment Variables:**
```bash
# In your DigitalOcean app, check if variables are set
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
```

### **2. Check Database Connection:**
```bash
# Test database connection
npx prisma db push
```

### **3. Check Logs:**
- Go to DigitalOcean App Platform
- Check **Runtime Logs** for error details

## 📱 **Testing After Setup:**

1. **Test Login:** `https://urchin-app-olxze.ondigitalocean.app/auth/signin`
2. **Test Registration:** `https://urchin-app-olxze.ondigitalocean.app/auth/signup`
3. **Test Admin:** `https://urchin-app-olxze.ondigitalocean.app/admin/login`
4. **Test Payment:** Try the prebook flow

## 🚨 **Security Notes:**

- Never commit `.env` files to Git
- Use strong, unique secrets for production
- Enable HTTPS in production
- Set up proper CORS policies
- Use production database credentials

## 📞 **Support:**

If you still get 500 errors after setting environment variables:
1. Check DigitalOcean logs for specific error messages
2. Verify database connection is working
3. Ensure all required environment variables are set
4. Check if the database schema is properly migrated
