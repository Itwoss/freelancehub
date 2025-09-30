import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    // In production, you would verify the webhook signature
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // )

    // For now, we'll parse the body as JSON
    const event = JSON.parse(body)

    console.log('Stripe webhook received:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Payment successful for session:', session.id)
        
        // Update booking status to paid
        try {
          await fetch(`${process.env.NEXTAUTH_URL}/api/bookings/${session.metadata.bookingId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'approved',
              paymentStatus: 'paid',
              paymentId: session.payment_intent
            })
          })
        } catch (error) {
          console.error('Failed to update booking status:', error)
        }
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        // Handle payment failure
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}