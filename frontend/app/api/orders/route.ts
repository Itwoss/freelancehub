import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const createOrderSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
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
      buyerId: session.user.id
    }

    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          project: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  rating: true
                }
              }
            }
          },
          review: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
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
    const { projectId } = createOrderSchema.parse(body)

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        author: true
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.authorId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot order your own project' },
        { status: 400 }
      )
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: session.user.id,
        projectId,
        totalAmount: project.price,
        status: 'PENDING'
      },
      include: {
        project: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true
              }
            }
          }
        }
      }
    })

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(project.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        projectId: project.id,
        buyerId: session.user.id,
        authorId: project.authorId
      }
    })

    // Update order with payment intent ID
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentIntent.id },
      include: {
        project: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      order: updatedOrder,
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

