import { NextRequest, NextResponse } from 'next/server'

interface NotificationData {
  userId: string
  adminId: string
  type: 'prebook' | 'payment' | 'order'
  title: string
  message: string
  orderId: string
  amount: number
  currency: string
  productTitle: string
  userDetails: {
    fullName: string
    email: string
    phone: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: NotificationData = await request.json()
    
    // Send notification to user
    await sendUserNotification(data)
    
    // Send notification to admin
    await sendAdminNotification(data)
    
    // Send email notifications
    await sendEmailNotifications(data)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}

async function sendUserNotification(data: NotificationData) {
  // This would integrate with your notification system
  // For now, we'll simulate storing in database
  
  const userNotification = {
    id: `user_${Date.now()}`,
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    orderId: data.orderId,
    timestamp: new Date().toISOString(),
    read: false
  }
  
  console.log('User notification created:', userNotification)
  
  // In a real app, you would:
  // 1. Store in database
  // 2. Send push notification
  // 3. Send real-time notification via WebSocket
}

async function sendAdminNotification(data: NotificationData) {
  const adminNotification = {
    id: `admin_${Date.now()}`,
    adminId: data.adminId,
    type: 'new_prebook',
    title: 'New Prebook Order',
    message: `New prebook order for ${data.productTitle} by ${data.userDetails.fullName}`,
    orderId: data.orderId,
    amount: data.amount,
    currency: data.currency,
    userDetails: data.userDetails,
    timestamp: new Date().toISOString(),
    read: false
  }
  
  console.log('Admin notification created:', adminNotification)
  
  // In a real app, you would:
  // 1. Store in admin notifications table
  // 2. Send real-time notification to admin dashboard
  // 3. Send email to admin
}

async function sendEmailNotifications(data: NotificationData) {
  // User confirmation email
  const userEmail = {
    to: data.userDetails.email,
    subject: `Prebook Confirmation - ${data.productTitle}`,
    template: 'prebook-confirmation',
    data: {
      userName: data.userDetails.fullName,
      productTitle: data.productTitle,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency
    }
  }
  
  // Admin notification email
  const adminEmail = {
    to: 'admin@freelancehub.com', // Your admin email
    subject: `New Prebook Order - ${data.productTitle}`,
    template: 'admin-prebook-notification',
    data: {
      productTitle: data.productTitle,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
      userDetails: data.userDetails
    }
  }
  
  console.log('Email notifications prepared:', { userEmail, adminEmail })
  
  // In a real app, you would:
  // 1. Use email service like SendGrid, AWS SES, etc.
  // 2. Send actual emails
}

// Get notifications for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') || 'all'
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    // Mock notifications - in real app, fetch from database
    const notifications = [
      {
        id: '1',
        type: 'prebook',
        title: 'Prebook Confirmed',
        message: 'Your prebook for YouTube has been confirmed',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Successful',
        message: 'Your payment of ₹100 has been processed',
        timestamp: new Date().toISOString(),
        read: true
      }
    ]
    
    return NextResponse.json({ notifications })
    
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
