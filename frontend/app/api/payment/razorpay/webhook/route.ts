import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { razorpayService } from '@/lib/razorpay-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    // Verify webhook signature
    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      )
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    console.log('Razorpay webhook received:', event)

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break

      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity)
        break

      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity)
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    console.log('Payment captured:', {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status
    })

    // Update order status in database
    // Send confirmation email to user
    // Send notification to admin
    // Update user dashboard
    // Trigger any post-payment actions

    // Send success notifications
    await sendPaymentSuccessNotifications(payment)

  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    console.log('Payment failed:', {
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      error: payment.error
    })

    // Update order status in database
    // Send failure notification to user
    // Log failure for analysis

    // Send failure notifications
    await sendPaymentFailureNotifications(payment)

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleOrderPaid(order: any) {
  try {
    console.log('Order paid:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status
    })

    // Update order status to 'paid'
    // Trigger fulfillment process
    // Send order confirmation

  } catch (error) {
    console.error('Error handling order paid:', error)
  }
}

async function handleRefundCreated(refund: any) {
  try {
    console.log('Refund created:', {
      refundId: refund.id,
      paymentId: refund.payment_id,
      amount: refund.amount,
      status: refund.status
    })

    // Update order status to 'refunded'
    // Send refund confirmation to user
    // Update admin dashboard

  } catch (error) {
    console.error('Error handling refund created:', error)
  }
}

async function sendPaymentSuccessNotifications(payment: any) {
  // Send notification to user
  const userNotification = {
    type: 'payment_success',
    title: 'Payment Successful',
    message: `Your payment of ₹${payment.amount / 100} has been processed successfully`,
    paymentId: payment.id,
    orderId: payment.order_id
  }
  
  // Send notification to admin
  const adminNotification = {
    type: 'new_payment',
    title: 'New Payment Received',
    message: `Payment of ₹${payment.amount / 100} received for order ${payment.order_id}`,
    paymentId: payment.id,
    orderId: payment.order_id
  }
  
  console.log('Success notifications:', { userNotification, adminNotification })
}

async function sendPaymentFailureNotifications(payment: any) {
  // Send notification to user
  const userNotification = {
    type: 'payment_failed',
    title: 'Payment Failed',
    message: `Your payment could not be processed. Please try again.`,
    paymentId: payment.id,
    orderId: payment.order_id
  }
  
  console.log('Failure notification:', userNotification)
}
