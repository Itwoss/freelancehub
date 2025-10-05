# 🚀 Production Deployment Checklist

## ✅ **Pre-Deployment Checklist**

### **1. Environment Variables Setup**
- [ ] `DATABASE_URL` - Production database connection string
- [ ] `NEXTAUTH_URL` - Set to `https://urchin-app-olxze.ondigitalocean.app`
- [ ] `NEXTAUTH_SECRET` - Strong, unique secret key
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Your live Razorpay key
- [ ] `RAZORPAY_KEY_SECRET` - Your live Razorpay secret
- [ ] `RAZORPAY_ENVIRONMENT` - Set to `production`
- [ ] `NEXT_PUBLIC_BASE_URL` - Set to your domain
- [ ] `NODE_ENV` - Set to `production`

### **2. Database Setup**
- [ ] Create production database (PostgreSQL recommended)
- [ ] Run database migrations: `npx prisma db push`
- [ ] Create admin user: `node scripts/production-setup.js`
- [ ] Test database connection

### **3. Razorpay Configuration**
- [ ] Update webhook URL to: `https://urchin-app-olxze.ondigitalocean.app/api/payment/razorpay/webhook`
- [ ] Enable webhook events: `payment.captured`, `payment.failed`, `order.paid`
- [ ] Test payment flow in production

### **4. Security Configuration**
- [ ] Enable HTTPS (should be automatic on DigitalOcean)
- [ ] Set strong passwords and secrets
- [ ] Configure CORS properly
- [ ] Remove development-only code

## 🔧 **DigitalOcean App Platform Setup**

### **1. App Configuration**
```yaml
# app.yaml (if using)
name: freelancehub
services:
- name: web
  source_dir: /frontend
  github:
    repo: Itwoss/freelancehub
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
```

### **2. Environment Variables in DigitalOcean**
Go to your app → Settings → App-Level Environment Variables:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_URL=https://urchin-app-olxze.ondigitalocean.app
NEXTAUTH_SECRET=your-strong-secret-here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RPjP2rRnGLu4yD
RAZORPAY_KEY_SECRET=ddorF1ExMdUIXbWwDsxvhwkV
RAZORPAY_ENVIRONMENT=production
NEXT_PUBLIC_BASE_URL=https://urchin-app-olxze.ondigitalocean.app
NODE_ENV=production
```

## 🐛 **Troubleshooting Common Issues**

### **Issue: 500 Internal Server Error**
**Causes:**
- Missing environment variables
- Database connection issues
- Missing dependencies
- Incorrect file paths

**Solutions:**
1. Check all environment variables are set
2. Verify database connection
3. Check DigitalOcean logs for specific errors
4. Ensure all dependencies are installed

### **Issue: Database Connection Failed**
**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Check database server is running
3. Ensure database credentials are correct
4. Test connection with `npx prisma db push`

### **Issue: Authentication Not Working**
**Solutions:**
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure JWT tokens are working
4. Test login endpoint directly

### **Issue: Payment Integration Failed**
**Solutions:**
1. Verify Razorpay credentials are correct
2. Check webhook URL is accessible
3. Ensure `RAZORPAY_ENVIRONMENT=production`
4. Test with real payment flow

## 📊 **Post-Deployment Testing**

### **1. Basic Functionality**
- [ ] Homepage loads: `https://urchin-app-olxze.ondigitalocean.app`
- [ ] User registration: `/auth/signup`
- [ ] User login: `/auth/signin`
- [ ] User dashboard: `/dashboard`
- [ ] Admin login: `/admin/login`
- [ ] Admin dashboard: `/admin/dashboard`

### **2. Payment Flow**
- [ ] Product preview: `/products/github`
- [ ] Payment page: `/payment/prebook`
- [ ] Razorpay integration works
- [ ] Order creation successful
- [ ] Admin can see orders

### **3. Database Operations**
- [ ] User creation works
- [ ] Order tracking works
- [ ] Admin user exists
- [ ] Data persistence works

## 🚨 **Emergency Rollback**

If production deployment fails:
1. Revert to previous working version
2. Check environment variables
3. Verify database connection
4. Test locally first
5. Re-deploy with fixes

## 📞 **Support Resources**

- **DigitalOcean Docs:** https://docs.digitalocean.com/products/app-platform/
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma Production:** https://www.prisma.io/docs/guides/deployment
- **Razorpay Integration:** https://razorpay.com/docs/

## 🎯 **Success Criteria**

Your deployment is successful when:
- ✅ All pages load without errors
- ✅ User registration and login work
- ✅ Payment integration works
- ✅ Admin dashboard accessible
- ✅ Database operations work
- ✅ No 500 errors in logs


