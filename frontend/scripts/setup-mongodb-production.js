#!/usr/bin/env node

/**
 * MongoDB Production Setup Script
 * Run this after setting up your MongoDB connection on DigitalOcean
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use MongoDB schema
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.MONGODB_URI
    }
  }
})

async function main() {
  console.log('🍃 Starting MongoDB production setup...')

  try {
    // Test MongoDB connection
    await prisma.$connect()
    console.log('✅ MongoDB connected successfully')

    // Create admin user if not exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@freelancehub.com' }
    })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@freelancehub.com',
          name: 'Admin User',
          hashedPassword: hashedPassword,
          role: 'ADMIN',
          bio: 'System Administrator',
          rating: 5.0
        }
      })
      
      console.log('✅ Admin user created:', admin.email)
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    // Create test user if not exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@freelancehub.com' }
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test123', 12)
      
      const user = await prisma.user.create({
        data: {
          email: 'test@freelancehub.com',
          name: 'Test User',
          hashedPassword: hashedPassword,
          role: 'USER',
          bio: 'Test user account',
          rating: 4.5
        }
      })
      
      console.log('✅ Test user created:', user.email)
    } else {
      console.log('ℹ️  Test user already exists')
    }

    // Get user count
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in MongoDB: ${userCount}`)

    // Test database operations
    console.log('🧪 Testing database operations...')
    
    // Test user creation
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        hashedPassword: await bcrypt.hash('password123', 12),
        role: 'USER',
        bio: 'Test user for production',
        rating: 4.0
      }
    })
    console.log('✅ User creation test passed')

    // Test user deletion
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('✅ User deletion test passed')

    console.log('🎉 MongoDB production setup completed successfully!')

  } catch (error) {
    console.error('❌ MongoDB setup failed:', error)
    
    if (error.code === 'P1001') {
      console.error('❌ Cannot reach MongoDB server. Check your MONGODB_URI connection string.')
    } else if (error.code === 'P1017') {
      console.error('❌ MongoDB server has closed the connection. Check your network access settings.')
    } else if (error.code === 'P2002') {
      console.error('❌ Unique constraint failed. User might already exist.')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ MongoDB setup error:', e)
    process.exit(1)
  })
