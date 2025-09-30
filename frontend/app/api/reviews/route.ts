import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createReviewSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const where = {
      projectId
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get reviews error:', error)
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
    const { orderId, rating, comment } = createReviewSchema.parse(body)

    // Check if order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        project: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.buyerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (order.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order must be completed to leave a review' },
        { status: 400 }
      )
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { orderId }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this order' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        reviewerId: session.user.id,
        projectId: order.projectId,
        orderId,
        rating,
        comment
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Update project author's rating
    const projectAuthor = await prisma.user.findUnique({
      where: { id: order.project.authorId },
      include: {
        reviews: {
          where: {
            project: {
              authorId: order.project.authorId
            }
          }
        }
      }
    })

    if (projectAuthor) {
      const totalReviews = projectAuthor.reviews.length
      const averageRating = projectAuthor.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews

      await prisma.user.update({
        where: { id: order.project.authorId },
        data: {
          rating: averageRating,
          totalReviews
        }
      })
    }

    // Create notification for project author
    await prisma.notification.create({
      data: {
        userId: order.project.authorId,
        title: 'New Review Received',
        message: `You received a ${rating}-star review for "${order.project.title}"`,
        type: 'REVIEW_RECEIVED'
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

