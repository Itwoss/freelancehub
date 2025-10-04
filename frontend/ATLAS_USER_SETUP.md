# MongoDB Atlas User Setup Guide

## 🔧 **Fix Authentication Issue**

Your current user `sanjay56` is not working. Let's create a new user with proper permissions.

### **Step 1: Go to MongoDB Atlas Dashboard**
1. Open your browser and go to: https://cloud.mongodb.com/
2. Log in to your Atlas account
3. Select your cluster: `itwos`

### **Step 2: Create New Database User**
1. **Click "Database Access"** in the left sidebar
2. **Click "Add New Database User"**
3. **Fill in the details:**
   - **Authentication Method**: Password
   - **Username**: `freelancehub-admin`
   - **Password**: `admin123456` (or any strong password you prefer)
   - **Database User Privileges**: "Read and write to any database"
4. **Click "Add User"**

### **Step 3: Check Network Access**
1. **Click "Network Access"** in the left sidebar
2. **Make sure you have an entry for "0.0.0.0/0"** (Allow access from anywhere)
3. **If not, click "Add IP Address"** and add "0.0.0.0/0"

### **Step 4: Get New Connection String**
1. **Click "Database"** in the left sidebar
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Select "Node.js"** as driver
5. **Copy the connection string**

**Your new connection string should look like:**
```
mongodb+srv://freelancehub-admin:admin123456@itwos.iwe0ita.mongodb.net/?retryWrites=true&w=majority&appName=itwos
```

### **Step 5: Update Your Application**
Once you have the new connection string, run:
```bash
cd frontend
node update-atlas-connection.js
```
Then paste your new connection string.

## 🎯 **Alternative: Use Existing User**
If you want to keep using `sanjay56`:
1. **Go to Database Access**
2. **Find user `sanjay56`**
3. **Click "Edit"**
4. **Change password to `sanjay.56`**
5. **Make sure privileges are "Read and write to any database"**
6. **Save changes**

## 🚨 **Common Issues:**
- **Wrong password**: Make sure password matches exactly
- **No permissions**: User must have "Read and write to any database"
- **Network blocked**: IP address must be whitelisted
- **Cluster paused**: Make sure cluster is running

## ✅ **Test Connection:**
After fixing the user, test with:
```bash
MONGODB_URI="your-new-connection-string" node test-atlas-connection.js
```
