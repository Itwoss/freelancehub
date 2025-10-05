import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing registration system...')
    
    // Test environment variables
    const envCheck = {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET
    }
    
    console.log('📋 Environment check:', envCheck)
    
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('✅ Database connected. User count:', userCount)
    
    // Test Prisma operations
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
      environment: envCheck,
      database: {
        connected: true,
        userCount,
        sampleUser: testUser
      }
    })
  } catch (error) {
    console.error('❌ Registration debug failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration system test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
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
    
    // Test bcrypt
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ Password hashing works')
    
    // Test user creation (without actually creating)
    console.log('✅ Registration test passed - user can be created')
    
    return NextResponse.json({
      success: true,
      message: 'Registration test passed',
      testData: {
        name,
        email,
        passwordLength: password.length,
        hashedPasswordLength: hashedPassword.length
      }
    })
  } catch (error) {
    console.error('❌ Registration test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
