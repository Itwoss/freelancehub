import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePrebookingSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'COMPLETED', 'CANCELLED', 'REFUNDED']).optional(),
  paymentId: z.string().optional(),
  orderId: z.string().optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updatePrebookingSchema.parse(body)

    // Update prebooking
    const prebooking = await prisma.prebooking.update({
      where: {
        id: params.id,
        userId: session.user.id // Ensure user can only update their own prebookings
      },
      data: {
        status: validatedData.status,
        paymentId: validatedData.paymentId,
        orderId: validatedData.orderId
      }
    })

    // If status is PAID, also update the related order
    if (validatedData.status === 'PAID') {
      await prisma.order.updateMany({
        where: {
          userId: session.user.id,
          projectId: `prebook_${prebooking.productId}`
        },
        data: {
          status: 'PAID'
        }
      })
    }

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

    console.error('Update prebooking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const prebooking = await prisma.prebooking.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!prebooking) {
      return NextResponse.json(
        { error: 'Prebooking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      prebooking
    })
  } catch (error) {
    console.error('Get prebooking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}