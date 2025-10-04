import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'

    let where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    const [payments, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          order: {
            select: {
              id: true,
              totalAmount: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.transaction.count({ where })
    ])

    return NextResponse.json({
      payments,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
