import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()

    // Define pricing plans
    const plans = {
      basic: {
        price: 499, // $4.99 in cents
        coins: 100,
        messages: 10,
        name: 'Basic Plan'
      },
      pro: {
        price: 1299, // $12.99 in cents
        coins: 300,
        messages: 30,
        name: 'Pro Plan'
      },
      premium: {
        price: 1999, // $19.99 in cents
        coins: 600,
        messages: 60,
        name: 'Premium Plan'
      }
    }

    const selectedPlan = plans[planId as keyof typeof plans]
    
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPlan.price,
      currency: 'usd',
      metadata: {
        userId: session.user.id,
        planId,
        coins: selectedPlan.coins.toString(),
        messages: selectedPlan.messages.toString(),
        planName: selectedPlan.name
      },
      description: `${selectedPlan.name} - ${selectedPlan.coins} Coins + ${selectedPlan.messages} Messages`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      plan: selectedPlan
    })

  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
