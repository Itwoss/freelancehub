# Razorpay Payment Integration Setup

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Razorpay Test Environment (for development)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_ENVIRONMENT=test

# For production (when ready)
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key_id_here
# RAZORPAY_KEY_SECRET=your_live_razorpay_key_secret_here
# RAZORPAY_ENVIRONMENT=live
```

## How to Get Razorpay Credentials

1. **Sign up for Razorpay Account:**
   - Go to [https://razorpay.com](https://razorpay.com)
   - Create a new account or sign in
   - Complete the KYC process

2. **Get Test Credentials:**
   - Go to Razorpay Dashboard
   - Navigate to Settings → API Keys
   - Generate Test API Keys
   - Copy the Key ID and Key Secret

3. **Configure Environment:**
   - Add the credentials to your `.env.local` file
   - Restart your development server

## Current Implementation

The payment system is configured to:
- ✅ Use real Razorpay integration when credentials are provided
- ✅ Fall back to mock payments for development when credentials are missing
- ✅ Handle both test and production environments
- ✅ Provide proper error handling and user feedback

## Testing

1. **With Real Credentials:**
   - Set up Razorpay test credentials
   - Test payments will use real Razorpay checkout
   - Use test card numbers for testing

2. **Without Credentials (Development Mode):**
   - System automatically uses mock payments
   - No real payment processing
   - Perfect for development and testing

## Test Card Numbers (Razorpay Test Mode)

- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

## Production Deployment

When ready for production:
1. Complete Razorpay KYC
2. Get live API keys
3. Update environment variables
4. Test with small amounts first
