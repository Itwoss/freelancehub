# Deployment Guide

This guide covers deploying the Freelance Marketplace application to various platforms.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)
**Best for**: Frontend deployment with automatic builds

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

3. **Deploy**
   - Vercel automatically builds and deploys
   - Get your live URL

### Option 2: Render (Full Stack)
**Best for**: Complete application with database

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   Build Command: npm run build
   Start Command: npm start
   Environment: Node
   ```

3. **Set Environment Variables**
   - Add all required environment variables
   - Include database connection string

4. **Deploy**
   - Render builds and deploys automatically
   - Get your live URL

## 🗄️ Database Setup

### PostgreSQL Options

#### Option 1: Render PostgreSQL
1. Create PostgreSQL service in Render
2. Copy connection string
3. Use in environment variables

#### Option 2: Supabase
1. Create project at [Supabase](https://supabase.com)
2. Get connection string from Settings → Database
3. Use in environment variables

#### Option 3: Railway
1. Create PostgreSQL service in Railway
2. Get connection string from Variables tab
3. Use in environment variables

### Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

## 🔧 Environment Configuration

### Required Variables
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Production Secrets
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Use live Stripe keys for production
- Set up proper email service for notifications
- Use HTTPS URLs for all webhook endpoints

## 🐳 Docker Deployment

### Build Docker Image
```bash
# Build image
docker build -t freelance-marketplace .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret" \
  freelance-marketplace
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/freelance_marketplace
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=freelance_marketplace
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔄 CI/CD Setup

### GitHub Actions
The repository includes automated CI/CD workflows:

1. **Automatic Testing**: Runs on every push/PR
2. **Security Scanning**: Weekly security audits
3. **Database Migration**: Manual migration workflow
4. **Deployment**: Automatic deployment to staging/production

### Required Secrets
Add these secrets to your GitHub repository:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
RENDER_API_KEY=your-render-api-key
RENDER_STAGING_SERVICE_ID=your-staging-service-id
RENDER_PRODUCTION_SERVICE_ID=your-production-service-id

# Notifications
SLACK_WEBHOOK=your-slack-webhook-url
SNYK_TOKEN=your-snyk-token
```

## 📊 Monitoring & Analytics

### Application Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging

### Database Monitoring
- **Prisma Studio**: Database management interface
- **PostgreSQL Monitoring**: Query performance and health
- **Backup Strategy**: Automated daily backups

## 🔒 Security Considerations

### Production Security
1. **HTTPS Only**: Ensure all traffic uses HTTPS
2. **Environment Variables**: Never commit secrets to repository
3. **Database Security**: Use strong passwords and connection limits
4. **API Rate Limiting**: Implement rate limiting on API endpoints
5. **CORS Configuration**: Properly configure CORS for your domain

### Stripe Security
1. **Webhook Verification**: Always verify Stripe webhook signatures
2. **Key Rotation**: Regularly rotate API keys
3. **PCI Compliance**: Use Stripe Elements for card handling
4. **Fraud Prevention**: Enable Stripe Radar for fraud detection

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### Database Connection Issues
- Verify DATABASE_URL format
- Check database server accessibility
- Ensure proper firewall rules
- Test connection with Prisma Studio

#### Authentication Issues
- Verify NEXTAUTH_URL matches your domain
- Check NEXTAUTH_SECRET is set
- Ensure session cookies work with your domain
- Check CORS settings

#### Payment Issues
- Verify Stripe keys are correct
- Check webhook endpoint configuration
- Ensure webhook secret is set
- Test with Stripe test mode first

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check Prisma connection
npm run db:studio
```

## 📈 Performance Optimization

### Frontend Optimization
- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Caching**: Implement proper caching headers
- **CDN**: Use Vercel's global CDN

### Database Optimization
- **Indexing**: Add indexes for frequently queried fields
- **Connection Pooling**: Configure Prisma connection pooling
- **Query Optimization**: Use Prisma's query optimization features
- **Caching**: Implement Redis for frequently accessed data

### API Optimization
- **Rate Limiting**: Implement API rate limiting
- **Response Caching**: Cache API responses where appropriate
- **Database Queries**: Optimize database queries
- **Error Handling**: Proper error handling and logging

## 🔄 Backup & Recovery

### Database Backups
```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### Automated Backups
- Set up daily automated backups
- Store backups in secure cloud storage
- Test backup restoration regularly
- Implement backup retention policies

## 📞 Support

### Getting Help
- Check the [Issues](https://github.com/yourusername/freelance-marketplace/issues) page
- Review deployment logs
- Check environment variable configuration
- Verify database connectivity

### Emergency Procedures
1. **Rollback**: Use previous deployment version
2. **Database Recovery**: Restore from latest backup
3. **Security Incident**: Rotate all secrets immediately
4. **Performance Issues**: Scale resources or optimize queries

### Monitoring Checklist
- [ ] Application is accessible
- [ ] Database is connected
- [ ] Authentication is working
- [ ] Payments are processing
- [ ] Emails are being sent
- [ ] Performance metrics are normal
- [ ] Error rates are low
- [ ] Security scans are clean

---

**Need help?** Contact our support team at [support@freelancehub.com](mailto:support@freelancehub.com) or join our [Discord Community](https://discord.gg/freelancehub).
