# Quick MongoDB Setup for FreelanceHub

## 🚀 **Option 1: MongoDB Atlas (Recommended - Easiest)**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (free tier available)

### **Step 2: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### **Step 3: Update Environment**
```bash
# Add to .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority
```

### **Step 4: Push Schema**
```bash
cd frontend
npx prisma db push
```

### **Step 5: Seed Database**
```bash
npx tsx prisma/seed-mongodb-simple.ts
```

---

## 🏠 **Option 2: Local MongoDB with Replica Set**

### **Step 1: Stop MongoDB**
```bash
# Stop current MongoDB
brew services stop mongodb/brew/mongodb-community
```

### **Step 2: Start with Replica Set**
```bash
# Start MongoDB with replica set
mongod --replSet rs0 --port 27017
```

### **Step 3: Initialize Replica Set**
```bash
# In another terminal
mongosh --eval "rs.initiate()"
```

### **Step 4: Update Environment**
```bash
# Add to .env.local
MONGODB_URI=mongodb://localhost:27017/freelancehub
```

### **Step 5: Push Schema and Seed**
```bash
npx prisma db push
npx tsx prisma/seed-mongodb-simple.ts
```

---

## 🎯 **Recommended: Use MongoDB Atlas**

MongoDB Atlas is easier to set up and doesn't require replica set configuration. It's also better for production use.

**Quick Atlas Setup:**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update `.env.local`
5. Run setup commands

**Benefits:**
- ✅ No local configuration needed
- ✅ Automatic replica set
- ✅ Free tier available
- ✅ Production ready
- ✅ Easy scaling
