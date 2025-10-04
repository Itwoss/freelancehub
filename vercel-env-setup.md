# Vercel Environment Variables Setup

## Required Environment Variables for Deployment

### 1. Basic Configuration
```
NODE_ENV=production
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

### 2. Database (MongoDB Atlas)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority
```

### 3. Razorpay Payment (Get from Razorpay Dashboard)
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

### 4. Email Configuration
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### 5. Admin Configuration
```
ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```

## How to Set in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable above
5. Click "Save"
6. Go to "Deployments" → "Redeploy"

## Alternative: Deploy with .env.local

Create a `.env.local` file in the frontend directory:

```bash
# Copy this to frontend/.env.local
NODE_ENV=production
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```

Then deploy:
```bash
cd frontend
vercel --prod
```
