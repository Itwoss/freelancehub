import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { userId, planId, coins, messages, planName } = paymentIntent.metadata

        // Update user's coins and message limits
        await prisma.user.update({
          where: { id: userId },
          data: {
            coins: {
              increment: parseInt(coins)
            },
            // You might want to add a separate table for message limits
            // For now, we'll just update the user record
          }
        })

        // Create a transaction record
        await prisma.transaction.create({
          data: {
            userId,
            type: 'COIN_PURCHASE',
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'COMPLETED',
            description: `${planName} - ${coins} Coins + ${messages} Messages`,
            metadata: {
              planId,
              coins: parseInt(coins),
              messages: parseInt(messages),
              stripePaymentIntentId: paymentIntent.id
            }
          }
        })

        console.log(`Payment succeeded for user ${userId}: ${coins} coins added`)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log(`Payment failed for payment intent ${failedPayment.id}`)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler failed:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}