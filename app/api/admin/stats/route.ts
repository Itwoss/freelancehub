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

    // Get current date for today's calculations
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)

    // Get basic counts
    const [
      totalUsers,
      totalProjects,
      totalOrders,
      totalRevenue,
      activeUsers,
      newUsersToday,
      projectsToday,
      ordersToday,
      revenueToday
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.user.count(), // All users are considered active
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfToday,
            lt: endOfToday
          }
        }
      }),
      prisma.project.count({
        where: {
          createdAt: {
            gte: startOfToday,
            lt: endOfToday
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: startOfToday,
            lt: endOfToday
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startOfToday,
            lt: endOfToday
          }
        },
        _sum: { totalAmount: true }
      })
    ])

    // Calculate derived metrics
    const averageOrderValue = totalOrders > 0 ? (totalRevenue._sum.totalAmount || 0) / totalOrders : 0
    
    // Calculate conversion rate (orders / users who have viewed projects)
    const usersWithOrders = await prisma.user.count({
      where: {
        orders: {
          some: {}
        }
      }
    })
    const conversionRate = totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0

    // Calculate user retention (users who created accounts within last 30 days / total users)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activeUsersLast30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    const userRetention = totalUsers > 0 ? (activeUsersLast30Days / totalUsers) * 100 : 0

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      activeUsers,
      newUsersToday,
      projectsToday,
      ordersToday,
      revenueToday: revenueToday._sum.totalAmount || 0,
      averageOrderValue,
      conversionRate,
      userRetention
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
