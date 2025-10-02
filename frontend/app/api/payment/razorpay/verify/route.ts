import { NextRequest, NextResponse } from 'next/server'
import { razorpayService } from '@/lib/razorpay-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = body

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields: razorpay_payment_id, razorpay_order_id, razorpay_signature' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const isValid = razorpayService.verifyPayment({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    }, razorpay_order_id)

    if (isValid) {
      // Payment verification successful
      console.log('Payment verified successfully:', {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      })

      // Store payment data in database (implement your database logic here)
      // Update order status to 'paid'
      // Send confirmation emails
      // Update user dashboard
      // Send notifications to admin

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Payment verification failed',
          details: 'Invalid signature'
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
