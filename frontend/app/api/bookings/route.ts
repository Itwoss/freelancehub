import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+1-555-0123',
    message: 'Looking forward to using this template!',
    status: 'pending',
    paymentStatus: 'pending',
    amount: 69,
    currency: 'USD',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    productId: '2',
    userId: '2',
    userName: 'Sarah Wilson',
    userEmail: 'sarah@example.com',
    userPhone: '+1-555-0456',
    message: 'Need this for my new project',
    status: 'approved',
    paymentStatus: 'paid',
    amount: 89,
    currency: 'USD',
    createdAt: new Date('2024-01-14T14:20:00Z'),
    updatedAt: new Date('2024-01-14T15:45:00Z')
  }
]

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
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    let filteredBookings = mockBookings

    // Filter by user if not admin
    if (session.user.role !== 'ADMIN' && userId) {
      filteredBookings = mockBookings.filter(booking => booking.userId === userId)
    }

    // Filter by status
    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status)
    }

    return NextResponse.json({
      bookings: filteredBookings,
      total: filteredBookings.length
    })
  } catch (error) {
    console.error('Get bookings error:', error)
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
    const { 
      productId, 
      userName, 
      userEmail, 
      userPhone, 
      message,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      cardholderName,
      country,
      postalCode
    } = body

    if (!productId || !userName || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new booking
    const newBooking = {
      id: Date.now().toString(),
      productId,
      userId: session.user.id,
      userName,
      userEmail,
      userPhone: userPhone || '',
      message: message || '',
      status: 'pending',
      paymentStatus: 'pending',
      amount: 69, // This should come from product data
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // In a real app, you would save this to MongoDB
    // For now, we'll just return the booking
    console.log('New booking created:', newBooking)

    // Send notification email to admin
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking_created',
          booking: newBooking,
          recipient: 'admin'
        })
      })
    } catch (error) {
      console.error('Failed to send notification:', error)
    }

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
