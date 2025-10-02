import { RAZORPAY_CONFIG, RAZORPAY_ENDPOINTS } from './razorpay-config'

export interface RazorpayOrder {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayPayment {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayResponse {
  success: boolean
  orderId?: string
  paymentId?: string
  error?: string
}

export class RazorpayService {
  private keyId: string
  private keySecret: string
  private environment: string

  constructor() {
    this.keyId = RAZORPAY_CONFIG.KEY_ID
    this.keySecret = RAZORPAY_CONFIG.KEY_SECRET
    this.environment = RAZORPAY_CONFIG.ENVIRONMENT
  }

  // Create Razorpay order
  async createOrder(orderData: RazorpayOrder): Promise<RazorpayResponse> {
    try {
      // Validate credentials
      if (!this.keyId || !this.keySecret) {
        throw new Error('Razorpay credentials not configured')
      }

      // Convert amount to paise/cents
      const currency = orderData.currency || 'INR'
      const multiplier = RAZORPAY_CONFIG.CURRENCY[currency as keyof typeof RAZORPAY_CONFIG.CURRENCY]?.multiplier || 100
      const amountInPaise = orderData.amount * multiplier

      // Create order payload
      const orderPayload = {
        amount: amountInPaise,
        currency: currency,
        receipt: orderData.receipt,
        notes: orderData.notes || {}
      }

      // Make API request to Razorpay
      const response = await fetch(RAZORPAY_ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`
        },
        body: JSON.stringify(orderPayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Razorpay API error: ${errorData.error?.description || response.statusText}`)
      }

      const order = await response.json()

      return {
        success: true,
        orderId: order.id
      }

    } catch (error) {
      console.error('Razorpay order creation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Verify payment signature
  verifyPayment(paymentData: RazorpayPayment, orderId: string): boolean {
    try {
      const crypto = require('crypto')
      const body = paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(body.toString())
        .digest('hex')

      return expectedSignature === paymentData.razorpay_signature
    } catch (error) {
      console.error('Payment verification error:', error)
      return false
    }
  }

  // Capture payment
  async capturePayment(paymentId: string, amount: number, currency: string = 'INR'): Promise<RazorpayResponse> {
    try {
      const multiplier = RAZORPAY_CONFIG.CURRENCY[currency as keyof typeof RAZORPAY_CONFIG.CURRENCY]?.multiplier || 100
      const amountInPaise = amount * multiplier

      const response = await fetch(`${RAZORPAY_ENDPOINTS.CAPTURE_PAYMENT}/${paymentId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: currency
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Payment capture error: ${errorData.error?.description || response.statusText}`)
      }

      const result = await response.json()

      return {
        success: result.status === 'captured',
        paymentId: result.id
      }

    } catch (error) {
      console.error('Payment capture error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Create refund
  async createRefund(paymentId: string, amount: number, notes?: string): Promise<RazorpayResponse> {
    try {
      const response = await fetch(RAZORPAY_ENDPOINTS.REFUND, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`
        },
        body: JSON.stringify({
          payment_id: paymentId,
          amount: amount,
          notes: notes ? { reason: notes } : undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Refund error: ${errorData.error?.description || response.statusText}`)
      }

      const refund = await response.json()

      return {
        success: refund.status === 'processed',
        paymentId: refund.id
      }

    } catch (error) {
      console.error('Refund creation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`${RAZORPAY_ENDPOINTS.CAPTURE_PAYMENT}/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch payment details: ${response.statusText}`)
      }

      return await response.json()

    } catch (error) {
      console.error('Get payment details error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService()
