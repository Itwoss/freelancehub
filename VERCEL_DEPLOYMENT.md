# 🚀 Vercel Deployment Guide for Freelance Marketplace

## 📋 Prerequisites

- ✅ GitHub repository: `Itwoss/freelancehub`
- ✅ Domain: `itwos.store`
- ✅ Razorpay credentials configured

## 🔧 Vercel Configuration

### **1. Project Structure**
```
freelancehub/
├── frontend/          # Next.js application
├── backend/           # Backend API (not needed for Vercel)
├── vercel.json        # Vercel configuration
├── .vercelignore      # Files to ignore
└── build.sh          # Build script
```

### **2. Environment Variables**
Add these in Vercel dashboard:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_ROUgP2Lh4axBmJ
RAZORPAY_KEY_SECRET=AS5OG9kx4JcJvSENFmKZQEs4
RAZORPAY_ENVIRONMENT=live
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=https://itwos.store
ADMIN_EMAIL=admin@itwos.store
```

### **3. Build Configuration**
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🌐 Domain Configuration

### **1. Add Domain in Vercel**
1. Go to Vercel dashboard
2. Settings → Domains
3. Add: `itwos.store`
4. Add: `www.itwos.store`

### **2. Configure DNS in GoDaddy**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600

Type: A
Name: @
Value: 76.76.19.61
TTL: 600
```

## 🔧 Razorpay Configuration

### **1. Update Webhook URL**
- **URL**: `https://itwos.store/api/payment/razorpay/webhook`
- **Events**: `payment.captured`, `payment.failed`, `order.paid`

### **2. Get Webhook Secret**
1. Go to Razorpay Dashboard
2. Settings → Webhooks
3. Create webhook with your domain
4. Copy webhook secret

## 🚀 Deployment Steps

### **1. Deploy to Vercel**
1. Go to https://vercel.com/
2. Import GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy

### **2. Configure Domain**
1. Add domain in Vercel
2. Configure DNS in GoDaddy
3. Wait for propagation (24-48 hours)

### **3. Test Deployment**
1. Test Vercel URL first
2. Test custom domain
3. Test payment flow
4. Verify webhooks

## 📊 Monitoring

### **1. Vercel Dashboard**
- View deployments
- Check build logs
- Monitor performance
- View analytics

### **2. Razorpay Dashboard**
- Monitor payments
- Check webhook delivery
- View transaction logs

## 🔧 Troubleshooting

### **Common Issues**
1. **Build fails**: Check environment variables
2. **Domain not working**: Check DNS configuration
3. **Payment not working**: Check Razorpay credentials
4. **Webhook not working**: Check webhook URL

### **Solutions**
1. **Redeploy**: Try redeploying the project
2. **Check logs**: Review build and deployment logs
3. **Verify config**: Ensure all settings are correct
4. **Contact support**: Use Vercel support if needed

## 🎉 Success Checklist

- [ ] Project deployed to Vercel
- [ ] Domain configured and working
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Razorpay webhook configured
- [ ] Payment flow tested
- [ ] Site accessible at `https://itwos.store`

## 📞 Support

- **Vercel Documentation**: https://vercel.com/docs
- **Razorpay Documentation**: https://razorpay.com/docs
- **Domain Help**: https://www.godaddy.com/help

---

**Your freelance marketplace is now ready for production! 🚀**
