import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { orderId, projectId, buyerId, authorId } = paymentIntent.metadata

        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        })

        // Create notifications
        await Promise.all([
          // Notification for buyer
          prisma.notification.create({
            data: {
              userId: buyerId,
              title: 'Payment Successful',
              message: 'Your payment has been processed successfully',
              type: 'PAYMENT_RECEIVED'
            }
          }),
          // Notification for seller
          prisma.notification.create({
            data: {
              userId: authorId,
              title: 'Payment Received',
              message: 'You have received a payment for your project',
              type: 'PAYMENT_RECEIVED'
            }
          })
        ])

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { orderId } = paymentIntent.metadata

        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CANCELLED' }
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

