import { NextRequest, NextResponse } from 'next/server'
import { razorpayService } from '@/lib/razorpay-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Create order request body:', body)
    
    const {
      amount,
      currency = 'INR',
      receipt,
      notes = {},
      productTitle,
      userDetails
    } = body

    console.log('Parsed fields:', { amount, currency, receipt, productTitle, userDetails })

    // Validate required fields
    if (!amount || !receipt) {
      console.error('Missing required fields:', { amount, receipt })
      return NextResponse.json(
        { error: 'Missing required fields: amount, receipt', received: { amount, receipt } },
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

    // Check if Razorpay credentials are configured (check for placeholder values too)
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    console.log('Checking Razorpay credentials:')
    console.log('Key ID:', keyId)
    console.log('Key Secret:', keySecret ? 'Set' : 'Not set')
    console.log('Environment:', process.env.RAZORPAY_ENVIRONMENT)
    
    if (!keyId || !keySecret || 
        keyId.includes('rzp_test_...') || keyId.includes('your-razorpay') ||
        keySecret.includes('your-razorpay') || keySecret.includes('secret')) {
      console.log('Razorpay credentials not properly configured, using mock order for development')
      
      // Create mock order for development
      const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: amount * 100, // Convert to paise
        currency,
        keyId: 'rzp_test_mock_key_id' // Mock key for development
      })
    }
    
    console.log('Using real Razorpay credentials for order creation')

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
        amount: amount * 100, // Convert to paise
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
