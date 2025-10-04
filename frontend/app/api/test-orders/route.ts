import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing orders API...')
    
    // Count total orders
    const totalOrders = await prisma.order.count()
    console.log('📊 Total orders in database:', totalOrders)
    
    // Get all orders with user and project details
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
    
    console.log('📋 Found orders:', orders.length)
    
    return NextResponse.json({
      success: true,
      totalOrders,
      orders,
      message: `Found ${totalOrders} orders in database`
    })
  } catch (error) {
    console.error('❌ Error in test orders API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch orders',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
