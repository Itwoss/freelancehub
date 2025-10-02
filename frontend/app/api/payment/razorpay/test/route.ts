import { NextRequest, NextResponse } from 'next/server'
import { RazorpayService } from '@/lib/razorpay-service'

export async function POST(request: NextRequest) {
  try {
    const { keyId, keySecret, environment } = await request.json()

    // Validate required fields
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Missing required fields: keyId, keySecret' },
        { status: 400 }
      )
    }

    // Create Razorpay service with provided credentials
    const razorpayServiceInstance = new RazorpayService()
    
    // Test the connection by creating a test order
    const testOrderData = {
      amount: 1, // 1 rupee for test
      currency: 'INR',
      receipt: `test_receipt_${Date.now()}`,
      notes: {
        test: 'true',
        environment: environment || 'test'
      }
    }

    const result = await razorpayServiceInstance.createOrder(testOrderData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Razorpay connection test successful',
        testData: {
          orderId: result.orderId,
          amount: testOrderData.amount,
          currency: testOrderData.currency
        }
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Razorpay connection test failed',
          details: result.error
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Razorpay test error:', error)
    return NextResponse.json(
      { 
        error: 'Razorpay connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
