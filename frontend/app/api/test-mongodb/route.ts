import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🍃 Testing MongoDB connection...')
    
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found')
      return NextResponse.json({
        success: false,
        message: 'MongoDB URI not configured',
        error: 'MONGODB_URI environment variable is missing'
      }, { status: 500 })
    }

    // Test MongoDB connection
    await prisma.$connect()
    console.log('✅ MongoDB connected successfully')

    // Test basic operations
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in MongoDB: ${userCount}`)

    // Test user creation (temporary)
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

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      userCount,
      database: 'MongoDB',
      connectionString: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
    }, { status: 200 })

  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json({
      success: false,
      message: 'MongoDB connection failed',
      error: errorMessage,
      database: 'MongoDB',
      connectionString: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
