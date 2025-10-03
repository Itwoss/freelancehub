import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              orders: true,
              reviews: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.project.count({ where })
    ])

    // Calculate average rating for each project
    const projectsWithStats = projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      author: project.author,
      price: project.price,
      status: project.status,
      createdAt: project.createdAt,
      orderCount: project._count.orders,
      reviewCount: project._count.reviews,
      averageRating: project.reviews.length > 0 
        ? project.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / project.reviews.length 
        : 0
    }))

    return NextResponse.json({
      projects: projectsWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching admin projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
