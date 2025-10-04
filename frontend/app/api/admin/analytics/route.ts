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

    // Get date ranges for analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // User growth over last 30 days
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Revenue growth over last 30 days
    const revenueGrowth = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Project categories distribution
    const projectCategories = await prisma.project.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    // Top projects by order count
    const topProjects = await prisma.project.findMany({
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
      orderBy: {
        orders: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Recent orders
    const recentOrders = await prisma.order.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // User activity over last 7 days (using createdAt as proxy for activity)
    const userActivity = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Format data for charts
    const formattedUserGrowth = userGrowth.map((item: any) => ({
      date: item.createdAt.toISOString().split('T')[0],
      users: item._count.id
    }))

    const formattedRevenueGrowth = revenueGrowth.map((item: any) => ({
      date: item.createdAt.toISOString().split('T')[0],
      revenue: item._sum.totalAmount || 0
    }))

    const formattedProjectCategories = projectCategories.map((item: any) => ({
      category: item.category,
      count: item._count.id
    }))

    const formattedTopProjects = topProjects.map((project: any) => ({
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

    const formattedUserActivity = userActivity.map((item: any) => ({
      date: item.createdAt.toISOString().split('T')[0],
      logins: item._count.id,
      projects: 0, // This would need additional queries
      orders: 0 // This would need additional queries
    }))

    return NextResponse.json({
      userGrowth: formattedUserGrowth,
      revenueGrowth: formattedRevenueGrowth,
      projectCategories: formattedProjectCategories,
      topProjects: formattedTopProjects,
      recentOrders,
      userActivity: formattedUserActivity
    })
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
