import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing orders API (no auth required)...')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId') || '68e0db7c9bdf60483873d968' // Default to admin user for testing

    console.log('👤 Fetching orders for user:', userId)

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
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
      prisma.order.count({ where: { userId } })
    ])

    console.log('📋 Found orders for user:', orders.length)

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
