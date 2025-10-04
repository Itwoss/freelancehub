import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('✅ Database connected. User count:', userCount)
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      userCount,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'USER' } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: email, password, name'
      }, { status: 400 })
    }

    console.log('🔍 Creating test user:', { email, name, role })
    
    // Check if user already exists
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
          name: existingUser.name,
          role: existingUser.role
        }
      }, { status: 400 })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        role,
        bio: 'Test user created via API',
        rating: 5.0
      }
    })
    
    console.log('✅ Test user created:', user.id)
    
    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('❌ Error creating test user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create test user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
