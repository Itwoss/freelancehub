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
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (status) {
      where.status = status
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              projects: true,
              orders: true
            }
          },
          orders: {
            select: {
              totalAmount: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Calculate total spent for each user
    const usersWithStats = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'ACTIVE', // All users are considered active
      createdAt: user.createdAt,
      lastLoginAt: user.updatedAt, // Use updatedAt as proxy for last activity
      projectCount: user._count.projects,
      orderCount: user._count.orders,
      totalSpent: user.orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
    }))

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
