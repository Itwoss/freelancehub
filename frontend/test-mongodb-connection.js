#!/usr/bin/env node

/**
 * Test MongoDB Connection with Your Credentials
 */

const { PrismaClient } = require('@prisma/client')

// Your actual MongoDB connection string
const MONGODB_URI = "mongodb+srv://sanjay56:sanjay@123@freelancehub-admin.vmep9bd.mongodb.net/freelance_marketplace?retryWrites=true&w=majority&appName=freelancehub-admin"

// Set environment variable for Prisma
process.env.MONGODB_URI = MONGODB_URI

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🍃 Testing MongoDB connection with your credentials...')
  console.log('📡 Connection String:', MONGODB_URI.replace(/sanjay@123/, '***'))

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ MongoDB connected successfully!')

    // Test user count
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}`)

    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@mongodb-test.com`,
        name: 'MongoDB Test User',
        hashedPassword: 'test-hash',
        role: 'USER',
        bio: 'Test user for MongoDB connection',
        rating: 4.0
      }
    })
    console.log('✅ User creation test passed')

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('✅ User deletion test passed')

    console.log('🎉 MongoDB connection test completed successfully!')
    console.log('✅ Your credentials are working perfectly!')

  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message)
    
    if (error.code === 'P1001') {
      console.error('❌ Cannot reach MongoDB server. Check your network connection.')
    } else if (error.code === 'P1017') {
      console.error('❌ MongoDB server has closed the connection. Check your credentials.')
    } else if (error.code === 'P2002') {
      console.error('❌ Unique constraint failed. User might already exist.')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .catch((e) => {
    console.error('❌ Test error:', e)
    process.exit(1)
  })
