import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')
    const read = searchParams.get('read')

    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (read !== null) {
      where.read = read === 'true'
    }

    let notifications, totalCount
    try {
      [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }),
        prisma.notification.count({ where })
      ])
    } catch (dbError) {
      console.warn('⚠️ Database not available for notifications, returning empty data:', dbError)
      notifications = []
      totalCount = 0
    }

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, read } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    let updatedNotification
    try {
      updatedNotification = await prisma.notification.update({
        where: { id },
        data: { read: read === true }
      })
    } catch (dbError) {
      console.warn('⚠️ Database not available for notification update:', dbError)
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    return NextResponse.json({ notification: updatedNotification })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    try {
      await prisma.notification.delete({
        where: { id }
      })
    } catch (dbError) {
      console.warn('⚠️ Database not available for notification deletion:', dbError)
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
