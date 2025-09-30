import nodemailer from 'nodemailer'

// Create a transporter for sending emails
const createTransporter = () => {
  // For development, we'll use Gmail SMTP
  // In production, use a service like SendGrid, Mailgun, or AWS SES
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password', // Use App Password for Gmail
    },
  })
}

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email configuration not found. Password reset link:')
      console.log(`   Email: ${email}`)
      console.log(`   Reset Link: ${resetLink}`)
      console.log('   To enable email sending, configure EMAIL_USER and EMAIL_PASS in your .env.local file')
      return { success: true, messageId: 'console-log' }
    }

    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'FreelanceHub <noreply@freelancehub.com>',
      to: email,
      subject: 'Reset Your Password - FreelanceHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">FreelanceHub</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Reset Your Password</p>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset your password for your FreelanceHub account.
            </p>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Click the button below to reset your password. This link will expire in 1 hour.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: 600; 
                        font-size: 16px;
                        display: inline-block;">
                Reset My Password
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #667eea; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
              ${resetLink}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0;">
              If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged.
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2025 FreelanceHub. All rights reserved.
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error: unknown) {
    console.error('❌ Error sending password reset email:', error)
    // Fallback to console log
    console.log('📧 Password reset link (fallback):')
    console.log(`   Email: ${email}`)
    console.log(`   Reset Link: ${resetLink}`)
    return { success: true, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'FreelanceHub <noreply@freelancehub.com>',
      to: email,
      subject: 'Welcome to FreelanceHub!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to FreelanceHub!</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Your journey starts here</p>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}!</h2>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Welcome to FreelanceHub! We're excited to have you join our community of talented freelancers and clients.
            </p>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Get started by exploring projects, creating your profile, or posting your first project.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: 600; 
                        font-size: 16px;
                        display: inline-block;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2025 FreelanceHub. All rights reserved.
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error: unknown) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
