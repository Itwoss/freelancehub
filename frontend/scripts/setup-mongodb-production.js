#!/usr/bin/env node

/**
 * MongoDB Production Setup Script
 * This script helps set up the MongoDB database and admin user in production
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use MongoDB schema
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.MONGODB_URI || process.env.DATABASE_URL
    }
  }
})

async function setupMongoDBProduction() {
  try {
    console.log('🍃 Setting up MongoDB production environment...')
    
    // Test MongoDB connection
    console.log('📊 Testing MongoDB connection...')
    await prisma.$connect()
    console.log('✅ MongoDB connected successfully')
    
    // Check if admin user exists
    console.log('👤 Checking for admin user...')
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
    } else {
      console.log('🔧 Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          hashedPassword,
          role: 'ADMIN',
          bio: 'System Administrator',
          rating: 5.0
        }
      })
      
      console.log('✅ Admin user created:', admin.email)
      console.log('🔐 Admin credentials:')
      console.log('   Email: admin@example.com')
      console.log('   Password: admin123')
    }
    
    // Check database collections
    console.log('📋 Checking MongoDB collections...')
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    const prebookingCount = await prisma.prebooking.count()
    
    console.log('📊 MongoDB statistics:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Orders: ${orderCount}`)
    console.log(`   Prebookings: ${prebookingCount}`)
    
    // Test creating a sample user
    console.log('🧪 Testing user creation...')
    try {
      const testUser = await prisma.user.findFirst({
        where: { email: 'test@example.com' }
      })
      
      if (!testUser) {
        const hashedTestPassword = await bcrypt.hash('test123', 12)
        await prisma.user.create({
          data: {
            email: 'test@example.com',
            name: 'Test User',
            hashedPassword: hashedTestPassword,
            role: 'USER',
            bio: 'Test user for production',
            rating: 0
          }
        })
        console.log('✅ Test user created successfully')
      } else {
        console.log('✅ Test user already exists')
      }
    } catch (error) {
      console.log('⚠️  Test user creation failed (this is normal if user exists):', error.message)
    }
    
    console.log('🎉 MongoDB production setup completed successfully!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Test login at: https://urchin-app-olxze.ondigitalocean.app/auth/signin')
    console.log('2. Test admin at: https://urchin-app-olxze.ondigitalocean.app/admin/login')
    console.log('3. Check MongoDB Atlas dashboard for data')
    
  } catch (error) {
    console.error('❌ MongoDB production setup failed:', error)
    console.error('')
    console.error('🔍 Troubleshooting:')
    console.error('1. Check MONGODB_URI environment variable')
    console.error('2. Verify MongoDB Atlas network access')
    console.error('3. Ensure database user has correct permissions')
    console.error('4. Check connection string format')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the setup
setupMongoDBProduction()
