import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Test order request body:', body)
    
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

    // Create mock order for testing
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('Mock Razorpay order created:', {
      orderId: mockOrderId,
      amount,
      currency,
      receipt,
      productTitle,
      userDetails
    })

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amount * 100, // Convert to paise
      currency,
      keyId: 'rzp_test_mock_key_id' // Mock key for testing
    })

  } catch (error) {
    console.error('Test order creation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
