import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPrebookingSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productTitle: z.string().min(1, 'Product title is required'),
  userDetails: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    message: z.string().optional()
  }),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('INR')
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    const [prebookings, total] = await Promise.all([
      prisma.prebooking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.prebooking.count({ where })
    ])

    return NextResponse.json({
      prebookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get prebookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createPrebookingSchema.parse(body)

    // Create prebooking record
    const prebooking = await prisma.prebooking.create({
      data: {
        productId: validatedData.productId,
        productTitle: validatedData.productTitle,
        userDetails: JSON.stringify(validatedData.userDetails),
        amount: validatedData.amount,
        currency: validatedData.currency,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      prebooking
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create prebooking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
