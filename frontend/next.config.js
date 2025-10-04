/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-app.ondigitalocean.app'],
    unoptimized: true
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
  }
}

module.exports = nextConfig