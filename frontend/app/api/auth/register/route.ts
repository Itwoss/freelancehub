import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Starting user registration...')
    console.log('🔍 Request URL:', request.url)
    console.log('🔍 Request method:', request.method)
    console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()))
    
    const body = await request.json()
    console.log('📝 Registration data:', { name: body.name, email: body.email })
    
    const { name, email, password } = registerSchema.parse(body)

    // Check database connection
    if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
      console.error('❌ No database URL found')
      console.error('Environment check:', {
        DATABASE_URL: process.env.DATABASE_URL,
        MONGODB_URI: process.env.MONGODB_URI,
        NODE_ENV: process.env.NODE_ENV
      })
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }
    
    // Test database connection
    try {
      await prisma.$connect()
      console.log('✅ REGISTER: Database connected successfully')
    } catch (dbError) {
      console.error('❌ REGISTER: Database connection failed:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }

    console.log('🔍 Checking if user already exists...')
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    console.log('🔍 Existing user check:', existingUser ? 'User exists' : 'User does not exist')

    if (existingUser) {
      console.log('❌ User already exists:', email)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    console.log('🔐 Hashing password...')
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('👤 Creating user...')
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashedPassword,
        role: 'USER',
        bio: 'New user',
        rating: 5.0
      }
    })

    console.log('✅ User created successfully:', user.id)
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors)
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

