// Razorpay Payment Gateway Configuration
export const RAZORPAY_CONFIG = {
  // Test Environment
  KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
  KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
  
  // Production Environment (uncomment when ready)
  // KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_PROD,
  // KEY_SECRET: process.env.RAZORPAY_KEY_SECRET_PROD,
  
  // Environment
  ENVIRONMENT: process.env.RAZORPAY_ENVIRONMENT || 'test', // 'test' or 'live'
  
  // Currency Configuration
  CURRENCY: {
    INR: {
      code: 'INR',
      symbol: '₹',
      multiplier: 100 // Amount in paise
    },
    USD: {
      code: 'USD', 
      symbol: '$',
      multiplier: 100 // Amount in cents
    }
  },
  
  // Payment Methods
  PAYMENT_METHODS: {
    UPI: 'upi',
    CARD: 'card',
    WALLET: 'wallet',
    NET_BANKING: 'netbanking',
    EMI: 'emi'
  },
  
  // Webhook Configuration
  WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'YOUR_WEBHOOK_SECRET',
  
  // Callback URLs
  SUCCESS_URL: process.env.NEXT_PUBLIC_BASE_URL + '/payment/success',
  FAILURE_URL: process.env.NEXT_PUBLIC_BASE_URL + '/payment/failed',
  
  // Admin Configuration
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@yourdomain.com'
}

// Razorpay API Endpoints
export const RAZORPAY_ENDPOINTS = {
  CREATE_ORDER: 'https://api.razorpay.com/v1/orders',
  CAPTURE_PAYMENT: 'https://api.razorpay.com/v1/payments',
  REFUND: 'https://api.razorpay.com/v1/refunds',
  WEBHOOK: 'https://api.razorpay.com/v1/webhooks'
}

// Razorpay SDK Configuration
export const RAZORPAY_OPTIONS = {
  key: RAZORPAY_CONFIG.KEY_ID,
  amount: 0, // Will be set dynamically
  currency: 'INR',
  name: 'Your Company Name',
  description: 'Payment for your order',
  image: '/logo.png', // Your company logo
  order_id: '', // Will be set dynamically
  handler: function (response: any) {
    // Handle successful payment
    console.log('Payment successful:', response)
  },
  prefill: {
    name: '',
    email: '',
    contact: ''
  },
  notes: {
    address: 'Your address'
  },
  theme: {
    color: '#6366f1' // Your brand color
  },
  modal: {
    ondismiss: function() {
      console.log('Payment modal closed')
    }
  }
}
