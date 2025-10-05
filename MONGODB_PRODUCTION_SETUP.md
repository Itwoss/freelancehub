# 🍃 MongoDB Production Setup Guide

## 🚀 **Quick MongoDB Setup for DigitalOcean**

### **Option 1: MongoDB Atlas (Recommended - FREE)**

1. **Create MongoDB Atlas Account:**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create new cluster (FREE tier available)

2. **Get Connection String:**
   - Go to **Database** → **Connect**
   - Choose **"Connect your application"**
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority`

3. **Set Environment Variables in DigitalOcean:**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority
   ```

### **Option 2: DigitalOcean Managed MongoDB**

1. **Create MongoDB Database in DigitalOcean:**
   - Go to DigitalOcean → **Databases**
   - Create new MongoDB database
   - Choose plan (Basic starts at $15/month)

2. **Get Connection String:**
   - Go to your database → **Connection Details**
   - Copy the connection string
   - Use it as `MONGODB_URI` and `DATABASE_URL`

## 🔧 **Environment Variables for MongoDB**

Add these to your DigitalOcean App Platform:

```bash
# MongoDB Connection (CRITICAL)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority

# Authentication (Required for login)
NEXTAUTH_URL=https://urchin-app-olxze.ondigitalocean.app
NEXTAUTH_SECRET=your-strong-secret-key-here

# Razorpay (Your live credentials)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RPjP2rRnGLu4yD
RAZORPAY_KEY_SECRET=ddorF1ExMdUIXbWwDsxvhwkV
RAZORPAY_ENVIRONMENT=production
NEXT_PUBLIC_BASE_URL=https://urchin-app-olxze.ondigitalocean.app

# App Configuration
NODE_ENV=production
```

## 📋 **Step-by-Step MongoDB Atlas Setup**

### **1. Create MongoDB Atlas Account:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"**
3. Sign up with email or Google
4. Choose **"Build a new app"**

### **2. Create Cluster:**
1. Choose **"Shared"** (FREE tier)
2. Select **"AWS"** as provider
3. Choose region closest to you
4. Name your cluster: `freelancehub-cluster`
5. Click **"Create Cluster"**

### **3. Set Up Database Access:**
1. Go to **Database Access** → **Add New Database User**
2. Username: `freelancehub-user`
3. Password: Generate strong password
4. Database User Privileges: **"Read and write to any database"**
5. Click **"Add User"**

### **4. Set Up Network Access:**
1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (for development)
3. For production, add your DigitalOcean IP ranges
4. Click **"Confirm"**

### **5. Get Connection String:**
1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy the connection string

### **6. Update Connection String:**
Replace `<password>` with your database user password:
```
mongodb+srv://freelancehub-user:YOUR_PASSWORD@freelancehub-cluster.xxxxx.mongodb.net/freelancehub?retryWrites=true&w=majority
```

## 🔄 **Update Prisma Schema for MongoDB**

Your project already has the MongoDB schema at `frontend/prisma/schema-mongodb.prisma`. To use it:

### **1. Update Prisma Configuration:**
```bash
# In your DigitalOcean app, set the schema file
PRISMA_SCHEMA_PATH=prisma/schema-mongodb.prisma
```

### **2. Generate Prisma Client:**
```bash
# This will be done automatically during deployment
npx prisma generate --schema=prisma/schema-mongodb.prisma
```

## 🚀 **Deployment Steps**

### **1. Set Environment Variables in DigitalOcean:**
1. Go to your app → **Settings** → **App-Level Environment Variables**
2. Add all the variables listed above
3. Make sure `MONGODB_URI` and `DATABASE_URL` are the same

### **2. Update Your App Configuration:**
Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "postinstall": "prisma generate --schema=prisma/schema-mongodb.prisma",
    "build": "prisma generate --schema=prisma/schema-mongodb.prisma && next build"
  }
}
```

### **3. Deploy and Test:**
1. Redeploy your app in DigitalOcean
2. Test database connection: `https://urchin-app-olxze.ondigitalocean.app/api/test-db`
3. Test login: `https://urchin-app-olxze.ondigitalocean.app/auth/signin`

## 🔍 **Testing MongoDB Connection**

### **1. Test Database Connection:**
Visit: `https://urchin-app-olxze.ondigitalocean.app/api/test-db`

Should show:
```json
{
  "success": true,
  "message": "Database connected successfully",
  "database": "MongoDB"
}
```

### **2. Test User Creation:**
1. Go to: `https://urchin-app-olxze.ondigitalocean.app/auth/signup`
2. Create a new user
3. Check MongoDB Atlas → **Browse Collections** → **users**

### **3. Test Admin User:**
1. Go to: `https://urchin-app-olxze.ondigitalocean.app/api/create-admin`
2. This will create admin user in MongoDB
3. Login with: `admin@example.com` / `admin123`

## 🛠️ **MongoDB Atlas Dashboard**

After setup, you can monitor your database:
- **Collections:** View all your data
- **Performance:** Monitor queries and performance
- **Alerts:** Set up notifications for issues
- **Backups:** Automatic backups (available in paid plans)

## 🔐 **Security Best Practices**

### **1. Network Access:**
- For production, restrict IP addresses
- Add only your DigitalOcean IP ranges
- Remove "Allow Access from Anywhere" in production

### **2. Database User:**
- Use strong passwords
- Create separate users for different environments
- Use least privilege principle

### **3. Connection String:**
- Never commit connection strings to Git
- Use environment variables
- Rotate passwords regularly

## 📊 **MongoDB Atlas Free Tier Limits**

- **Storage:** 512 MB
- **Connections:** 100 concurrent connections
- **Backups:** 2 GB backup storage
- **Perfect for:** Development and small production apps

## 🎯 **Expected Results**

After setting up MongoDB:

✅ **Database Connection:** No more 500 errors  
✅ **User Registration:** Works with MongoDB  
✅ **User Login:** Authentication works  
✅ **Admin Access:** Admin dashboard accessible  
✅ **Data Persistence:** All data stored in MongoDB  
✅ **Scalability:** Easy to scale with MongoDB Atlas  

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Connection Failed:**
   - Check network access in MongoDB Atlas
   - Verify connection string format
   - Ensure database user has correct permissions

2. **Authentication Failed:**
   - Verify username and password
   - Check if user exists in database
   - Ensure proper database privileges

3. **Schema Issues:**
   - Make sure you're using `schema-mongodb.prisma`
   - Run `npx prisma generate` with correct schema
   - Check if all required fields are present

**MongoDB Atlas is the easiest and most reliable option for your production deployment!** 🎉


