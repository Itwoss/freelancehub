import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          project: {
            select: {
              id: true,
              title: true,
              price: true,
              category: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where: { userId: session.user.id } })
    ])

    return NextResponse.json({
      orders,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId, amount, paymentMethod } = await request.json()

    if (!productId || !amount) {
      return NextResponse.json(
        { error: 'Product ID and amount are required' },
        { status: 400 }
      )
    }

    // Get product details
    const product = await prisma.project.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        projectId: productId,
        totalAmount: amount,
        status: 'PENDING',
        paymentMethod: paymentMethod || 'razorpay',
        shippingAddress: {
          street: 'Sample Street',
          city: 'Sample City',
          state: 'Sample State',
          zipCode: '123456',
          country: 'India'
        },
        billingAddress: {
          street: 'Sample Street',
          city: 'Sample City',
          state: 'Sample State',
          zipCode: '123456',
          country: 'India'
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Order created successfully',
      order
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}