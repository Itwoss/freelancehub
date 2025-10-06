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

    // Return mock test data for development
    const mockOrders = [
      {
        id: 'test-order-1',
        totalAmount: 1500,
        status: 'COMPLETED',
        createdAt: new Date('2024-01-15'),
        user: {
          name: 'Test User',
          email: 'test@example.com'
        },
        project: {
          id: 'test-project-1',
          title: 'Test Project 1',
          price: 1500,
          category: 'Web Development'
        }
      },
      {
        id: 'test-order-2',
        totalAmount: 2500,
        status: 'PENDING',
        createdAt: new Date('2024-01-16'),
        user: {
          name: 'Test User',
          email: 'test@example.com'
        },
        project: {
          id: 'test-project-2',
          title: 'Test Project 2',
          price: 2500,
          category: 'Mobile Development'
        }
      }
    ]

    return NextResponse.json({
      orders: mockOrders,
      totalCount: mockOrders.length,
      page: 1,
      limit: 10,
      totalPages: 1
    })
  } catch (error) {
    console.error('Error fetching test orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test orders' },
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

    // Create test order
    const testOrder = {
      id: `test-order-${Date.now()}`,
      userId: session.user.id,
      projectId: productId,
      totalAmount: amount,
      status: 'PENDING',
      createdAt: new Date(),
      user: {
        name: session.user.name || 'Test User',
        email: session.user.email || 'test@example.com'
      },
      project: {
        id: productId,
        title: 'Test Product',
        price: amount,
        category: 'Test Category'
      }
    }

    return NextResponse.json({
      message: 'Test order created successfully',
      order: testOrder
    })
  } catch (error) {
    console.error('Error creating test order:', error)
    return NextResponse.json(
      { error: 'Failed to create test order' },
      { status: 500 }
    )
  }
}
