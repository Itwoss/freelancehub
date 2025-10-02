import { NextRequest, NextResponse } from 'next/server'
import { razorpayService } from '@/lib/razorpay-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      currency = 'INR',
      receipt,
      notes = {},
      productTitle,
      userDetails
    } = body

    // Validate required fields
    if (!amount || !receipt) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, receipt' },
        { status: 400 }
      )
    }

    // Create order data
    const orderData = {
      amount,
      currency,
      receipt,
      notes: {
        product_title: productTitle || 'Product Purchase',
        user_name: userDetails?.name || '',
        user_email: userDetails?.email || '',
        user_phone: userDetails?.phone || '',
        ...notes
      }
    }

    // Create Razorpay order
    const result = await razorpayService.createOrder(orderData)

    if (result.success) {
      // Store order data in database (implement your database logic here)
      console.log('Razorpay order created successfully:', {
        orderId: result.orderId,
        amount,
        currency,
        receipt,
        productTitle,
        userDetails
      })

      return NextResponse.json({
        success: true,
        orderId: result.orderId,
        amount,
        currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to create order',
          details: result.error
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
