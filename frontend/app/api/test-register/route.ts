import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing registration system...')
    
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('✅ Database connected. User count:', userCount)
    
    // Test Prisma schema
    const testUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Registration system is working',
      database: {
        connected: true,
        userCount,
        sampleUser: testUser
      },
      environment: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('❌ Registration test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration system test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Testing user creation...')
    
    const { name, email, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name
        }
      }, { status: 400 })
    }
    
    // Test user creation (without actually creating)
    console.log('✅ Registration test passed - user can be created')
    
    return NextResponse.json({
      success: true,
      message: 'Registration test passed',
      testData: {
        name,
        email,
        passwordLength: password.length
      }
    })
  } catch (error) {
    console.error('❌ Registration test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
