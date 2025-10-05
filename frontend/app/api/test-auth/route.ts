import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔍 Testing authentication for:', email)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (!user.hashedPassword) {
      return NextResponse.json({ error: 'No password hash' }, { status: 400 })
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.hashedPassword)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    })
    
  } catch (error) {
    console.error('❌ Auth test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
