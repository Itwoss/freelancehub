import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔍 LOGIN: Attempting login for:', email)
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ LOGIN: User not found')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    if (!user.hashedPassword) {
      console.log('❌ LOGIN: No password hash')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword)
    
    if (!isValidPassword) {
      console.log('❌ LOGIN: Invalid password')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    console.log('✅ LOGIN: Authentication successful for:', user.email)
    
    // Create JWT token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')
    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(secret)
    
    // Set cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('❌ LOGIN: Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
