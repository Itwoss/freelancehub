import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const { id, action } = params

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Order ID and action are required' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'complete':
        updateData.status = 'COMPLETED'
        updateData.completedAt = new Date()
        break
      case 'cancel':
        updateData.status = 'CANCELLED'
        updateData.cancelledAt = new Date()
        break
      case 'refund':
        updateData.status = 'REFUNDED'
        updateData.refundedAt = new Date()
        break
      case 'ship':
        updateData.status = 'SHIPPED'
        updateData.shippedAt = new Date()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        project: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      message: `Order ${action} successful`,
      order
    })
  } catch (error) {
    console.error(`Error ${params.action} order:`, error)
    return NextResponse.json(
      { error: `Failed to ${params.action} order` },
      { status: 500 }
    )
  }
}
