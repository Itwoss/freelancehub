import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = adminLoginSchema.parse(body)

    // Find admin user (simplified for MongoDB)
    const admin = await prisma.user.findUnique({
      where: { 
        email,
        role: 'ADMIN' // Only allow ADMIN role users
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access denied. Invalid credentials.' },
        { status: 401 }
      )
    }

    // For development, skip password validation
    // In production, implement proper password checking

    // Return admin data (without password)
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        image: admin.image,
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


