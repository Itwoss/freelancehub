import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test with your credentials directly
    const keyId = 'rzp_live_ROrn7ahgdd5X2d'
    const keySecret = 'u8DBqFba66vdYLTLYXr0yDAh'

    const testResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        amount: 100, // 1 rupee in paise
        currency: 'INR',
        receipt: 'test_connection_' + Date.now()
      })
    })

    if (!testResponse.ok) {
      const errorData = await testResponse.json()
      return NextResponse.json(
        { 
          success: false,
          error: 'Razorpay connection failed', 
          details: errorData.error?.description || 'Invalid credentials'
        },
        { status: 400 }
      )
    }

    const orderData = await testResponse.json()

    return NextResponse.json({ 
      success: true, 
      message: 'Razorpay connection successful',
      orderId: orderData.id,
      credentials: {
        keyId: keyId,
        keySecretLength: keySecret.length
      }
    })

  } catch (error) {
    console.error('Error testing Razorpay connection:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test connection', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
