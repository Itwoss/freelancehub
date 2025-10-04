import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    let notifications
    try {
      notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    } catch (dbError) {
      console.warn('⚠️ Database not available for notifications, returning empty data:', dbError)
      notifications = []
    }

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type = 'GENERAL' } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    let notification
    try {
      notification = await prisma.notification.create({
        data: {
          title,
          message,
          type,
          read: false
        }
      })
    } catch (dbError) {
      console.warn('⚠️ Database not available for notification creation:', dbError)
      // Return a mock notification for development
      notification = {
        id: 'temp_' + Date.now(),
        title,
        message,
        type,
        read: false,
        createdAt: new Date()
      }
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}