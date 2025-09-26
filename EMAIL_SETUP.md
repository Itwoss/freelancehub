# Email Setup Guide

This guide explains how to configure email functionality for the FreelanceHub application.

## 🔧 Current Status

The forgot password functionality is working, but emails are currently being logged to the console instead of being sent via email. To enable actual email sending, you need to configure email credentials.

## 📧 Email Configuration Options

### Option 1: Gmail SMTP (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Update your `.env.local` file**:
   ```env
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-16-character-app-password"
   EMAIL_FROM="FreelanceHub <noreply@freelancehub.com>"
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up for SendGrid** (free tier available)
2. **Get your API key** from SendGrid dashboard
3. **Update your `.env.local` file**:
   ```env
   SENDGRID_API_KEY="SG.your-sendgrid-api-key"
   EMAIL_FROM="FreelanceHub <noreply@freelancehub.com>"
   ```

### Option 3: Mailgun (Alternative for Production)

1. **Sign up for Mailgun** (free tier available)
2. **Get your API key and domain** from Mailgun dashboard
3. **Update your `.env.local` file**:
   ```env
   MAILGUN_API_KEY="your-mailgun-api-key"
   MAILGUN_DOMAIN="your-mailgun-domain"
   EMAIL_FROM="FreelanceHub <noreply@freelancehub.com>"
   ```

## 🚀 Quick Setup (Gmail)

1. **Copy the example environment file**:
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local`** and add your Gmail credentials:
   ```env
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_FROM="FreelanceHub <noreply@freelancehub.com>"
   ```

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

4. **Test the forgot password functionality**:
   - Go to `/auth/signin`
   - Click "Forgot your password?"
   - Enter an email address
   - Check your email inbox (and spam folder)

## 🔍 Troubleshooting

### Email not being sent?
- Check the console logs for error messages
- Verify your email credentials are correct
- Make sure you're using an App Password (not your regular password) for Gmail
- Check your spam folder

### Gmail App Password not working?
- Ensure 2-Factor Authentication is enabled
- Generate a new App Password specifically for "Mail"
- Make sure there are no spaces in the App Password

### Still having issues?
- Check the server console for detailed error messages
- Verify your `.env.local` file has the correct format
- Try a different email service (SendGrid, Mailgun)

## 📱 Current Behavior

**Without email configuration:**
- Password reset links are logged to the console
- Users see "Password reset link sent to your email" message
- Links work for password reset functionality

**With email configuration:**
- Password reset links are sent via email
- Professional HTML email templates
- Users receive actual emails in their inbox

## 🎯 Next Steps

1. **For Development**: Use Gmail SMTP with App Password
2. **For Production**: Use SendGrid or Mailgun
3. **For Testing**: Current console logging works perfectly

The forgot password functionality is fully working - you just need to configure email credentials to send actual emails instead of logging to console.


