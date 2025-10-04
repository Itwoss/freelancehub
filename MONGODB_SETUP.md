# MongoDB Setup Guide for FreelanceHub

## 🚀 **MongoDB Integration Options**

### **Option 1: Local MongoDB (Recommended for Development)**
- **Pros**: Free, full control, offline development
- **Cons**: Need to install and manage locally

### **Option 2: MongoDB Atlas (Cloud)**
- **Pros**: Managed service, no local installation, scalable
- **Cons**: Requires internet connection, free tier limitations

## 📋 **Setup Instructions**

### **Step 1: Choose Your MongoDB Setup**

#### **Option A: Local MongoDB**
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Verify installation
mongosh --version
```

#### **Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string

### **Step 2: Configure Environment Variables**

Update your `.env.local` file:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/freelancehub

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority

# Keep existing variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### **Step 3: Update Prisma Schema**

Replace your current `schema.prisma` with the MongoDB version:
```bash
cd frontend
cp prisma/schema-mongodb.prisma prisma/schema.prisma
```

### **Step 4: Generate Prisma Client**

```bash
npx prisma generate
```

### **Step 5: Push Schema to MongoDB**

```bash
npx prisma db push
```

### **Step 6: Seed Database**

```bash
npx tsx prisma/seed-mongodb.ts
```

## 🔄 **Migration from SQLite to MongoDB**

If you want to migrate existing data:

```bash
# Run the migration script
node migrate-to-mongodb.js
```

## 📊 **MongoDB vs SQLite Comparison**

| Feature | SQLite | MongoDB |
|---------|--------|---------|
| **Type** | Relational | Document |
| **Scalability** | Limited | High |
| **Performance** | Good for small apps | Excellent for large apps |
| **Complexity** | Simple | Moderate |
| **Cloud Support** | Limited | Excellent |
| **JSON Support** | Limited | Native |

## 🎯 **MongoDB Advantages for FreelanceHub**

### **1. Better for Social Features**
- **Posts**: Store rich content with embedded media
- **Stories**: Handle complex media types
- **Comments**: Nested comment structures

### **2. Flexible Schema**
- **User Profiles**: Dynamic profile fields
- **Project Details**: Varying project requirements
- **Notifications**: Rich notification content

### **3. Scalability**
- **Horizontal Scaling**: Easy to scale across servers
- **Sharding**: Distribute data across multiple machines
- **Replication**: High availability and fault tolerance

## 🛠 **MongoDB Features for FreelanceHub**

### **1. Document Storage**
```javascript
// User document with embedded data
{
  _id: ObjectId("..."),
  name: "John Smith",
  email: "john@example.com",
  profile: {
    bio: "Full-stack developer",
    skills: ["React", "Node.js", "MongoDB"],
    social: {
      twitter: "@johnsmith",
      github: "johnsmith"
    }
  },
  projects: [
    {
      title: "E-commerce Platform",
      status: "active",
      createdAt: ISODate("2024-01-01")
    }
  ]
}
```

### **2. Aggregation Pipeline**
```javascript
// Complex queries for analytics
db.projects.aggregate([
  { $match: { status: "ACTIVE" } },
  { $group: { _id: "$category", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

### **3. Full-Text Search**
```javascript
// Search across multiple fields
db.projects.find({
  $text: { $search: "e-commerce platform" }
})
```

## 🔧 **Development Commands**

### **MongoDB Shell Commands**
```bash
# Connect to MongoDB
mongosh

# Use database
use freelancehub

# Show collections
show collections

# Query data
db.users.find()
db.projects.find({ status: "ACTIVE" })
```

### **Prisma Commands**
```bash
# Generate client
npx prisma generate

# Push schema
npx prisma db push

# View data
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

## 🚨 **Important Notes**

### **1. Data Migration**
- **Backup First**: Always backup your SQLite data
- **Test Migration**: Test with a copy of your data
- **Verify Data**: Check that all data migrated correctly

### **2. Environment Variables**
- **Local MongoDB**: `mongodb://localhost:27017/freelancehub`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/freelancehub`

### **3. Production Considerations**
- **Connection Pooling**: Configure connection limits
- **Indexing**: Add indexes for better performance
- **Monitoring**: Set up MongoDB monitoring

## 🎉 **Benefits of MongoDB for FreelanceHub**

1. **Better Performance**: Faster queries for complex data
2. **Scalability**: Easy to scale as your app grows
3. **Flexibility**: Easy to add new features
4. **Cloud Ready**: Perfect for deployment
5. **Rich Queries**: Complex analytics and reporting
6. **JSON Native**: Perfect for modern web apps

## 📞 **Support**

If you need help with MongoDB setup:
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Prisma MongoDB Guide**: https://www.prisma.io/docs/concepts/database-connectors/mongodb
- **MongoDB Atlas**: https://www.mongodb.com/atlas

---

**Ready to migrate to MongoDB? Run the setup script:**
```bash
node setup-mongodb.js
```
