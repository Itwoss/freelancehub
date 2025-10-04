# DigitalOcean App Platform Deployment Guide

## 🚀 Deploy Your Next.js App to DigitalOcean

### Prerequisites
- DigitalOcean account
- GitHub repository: `Itwoss/freelancehub`
- MongoDB Atlas database
- Razorpay account (for payments)

### Step 1: Create DigitalOcean App

1. **Go to DigitalOcean App Platform:**
   - Visit: [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Click **"Create App"**

2. **Connect GitHub:**
   - Choose **"GitHub"** as source
   - Select **"Itwoss/freelancehub"** repository
   - Choose **"main"** branch

3. **Configure App:**
   - **Name:** `freelancehub`
   - **Source Directory:** `/frontend`
   - **Build Command:** `npm run build`
   - **Run Command:** `npm start`
   - **Environment:** Node.js

### Step 2: Set Environment Variables

In the App Platform dashboard, add these environment variables:

```bash
# Basic Configuration
NODE_ENV=production
NEXTAUTH_URL=https://your-app.ondigitalocean.app
NEXTAUTH_SECRET=your-random-secret-key

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_BASE_URL=https://your-app.ondigitalocean.app
```

### Step 3: Deploy

1. **Review Settings:**
   - Check all environment variables
   - Verify build and run commands
   - Set instance size (Basic XXS for testing)

2. **Deploy:**
   - Click **"Create Resources"**
   - Wait for build to complete (5-10 minutes)
   - Get your live URL!

### Step 4: Custom Domain Setup

1. **In DigitalOcean:**
   - Go to your app settings
   - Click **"Domains"**
   - Add your GoDaddy domain

2. **In GoDaddy DNS:**
   - Add CNAME record: `www` → `your-app.ondigitalocean.app`
   - Add A record: `@` → DigitalOcean IP

### Step 5: Database Setup

1. **MongoDB Atlas:**
   - Create cluster
   - Get connection string
   - Add to environment variables

2. **Seed Database:**
   - Run seeding script locally
   - Or use MongoDB Atlas interface

### Step 6: Payment Setup

1. **Razorpay:**
   - Get API keys from dashboard
   - Add to environment variables
   - Configure webhooks

### Troubleshooting

**Build Fails:**
- Check environment variables
- Verify build command
- Check logs in DigitalOcean dashboard

**Database Connection:**
- Verify MongoDB URI
- Check network access in Atlas
- Test connection locally first

**Payment Issues:**
- Verify Razorpay keys
- Check webhook configuration
- Test with test mode first

### Cost Estimation

- **Basic XXS:** $5/month
- **Basic XS:** $12/month
- **Basic S:** $24/month

### Support

- DigitalOcean Documentation: [docs.digitalocean.com](https://docs.digitalocean.com)
- App Platform Guide: [docs.digitalocean.com/products/app-platform](https://docs.digitalocean.com/products/app-platform)
