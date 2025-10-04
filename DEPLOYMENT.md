# 🚀 Deployment Guide for GoDaddy Domain

## Option 1: Vercel (Recommended - Easiest)

### Step 1: Prepare Your Project
1. Ensure all changes are committed to GitHub
2. Create a Vercel account at [vercel.com](https://vercel.com)
3. Connect your GitHub repository

### Step 2: Deploy to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Deploy!

### Step 3: Configure Custom Domain
1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Domains"
3. Add your GoDaddy domain
4. Update DNS records in GoDaddy (see DNS configuration below)

## Option 2: Netlify

### Step 1: Build Configuration
Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings
4. Deploy!

## Option 3: DigitalOcean App Platform

### Step 1: Create App Spec
Create `.do/app.yaml`:

```yaml
name: freelancehub
services:
- name: web
  source_dir: /
  github:
    repo: your-username/freelancehub
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: NODE_ENV
    value: production
```

### Step 2: Deploy to DigitalOcean
1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Configure environment variables
4. Deploy!

## DNS Configuration for GoDaddy

### For Vercel:
1. Go to GoDaddy DNS Management
2. Add these records:
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
   - Type: A, Name: @, Value: 76.76.19.61
3. Wait for DNS propagation (up to 24 hours)

### For Netlify:
1. Go to GoDaddy DNS Management
2. Add these records:
   - Type: CNAME, Name: www, Value: your-site.netlify.app
   - Type: A, Name: @, Value: 75.2.60.5

## Environment Variables Setup

### Required Production Variables:
```bash
# Database
DATABASE_URL="your_production_database_url"
MONGODB_URI="your_production_mongodb_uri"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your_production_secret"

# Razorpay (Get from Razorpay Dashboard)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="your_live_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Email
EMAIL_USER="your_email@domain.com"
EMAIL_PASS="your_email_password"
EMAIL_FROM="noreply@your-domain.com"

# Admin
ADMIN_EMAIL="admin@your-domain.com"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Update MONGODB_URI in environment variables

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MongoDB service
4. Get connection string

### Option 3: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string

## SSL Certificate
- Vercel: Automatic SSL
- Netlify: Automatic SSL
- DigitalOcean: Automatic SSL

## Monitoring & Analytics
- Vercel Analytics (built-in)
- Google Analytics
- Sentry for error tracking

## Backup Strategy
1. Database backups (automated with MongoDB Atlas)
2. Code backups (GitHub)
3. Environment variables backup

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version compatibility
2. **Database Connection**: Verify connection strings
3. **Environment Variables**: Ensure all required variables are set
4. **DNS Issues**: Wait for DNS propagation (up to 24 hours)

### Support:
- Vercel: [vercel.com/help](https://vercel.com/help)
- Netlify: [netlify.com/support](https://netlify.com/support)
- DigitalOcean: [digitalocean.com/support](https://digitalocean.com/support)