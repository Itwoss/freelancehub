import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

// Create a transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Contact form submission started')
    
    const body = await request.json()
    console.log('📧 Request body:', { name: body.name, email: body.email, subject: body.subject })
    
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('❌ Validation failed: missing required fields')
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save contact form submission to database (with fallback)
    console.log('💾 Saving contact submission to database...')
    let contactSubmission
    try {
      contactSubmission = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject,
          message,
          status: 'NEW',
          createdAt: new Date(),
        },
      })
      console.log('✅ Contact submission saved:', contactSubmission.id)
    } catch (dbError) {
      console.warn('⚠️ Database not available, continuing with email notifications only:', dbError)
      // Create a mock contact submission for email purposes
      contactSubmission = {
        id: 'temp_' + Date.now(),
        name,
        email,
        subject,
        message,
        status: 'NEW',
        createdAt: new Date(),
      }
    }

    // Create notification for admin users (with fallback)
    try {
      console.log('🔔 Creating admin notifications...')
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      })
      console.log('👥 Found admin users:', adminUsers.length)

      await Promise.all(
        adminUsers.map((admin: any) => 
          prisma.notification.create({
            data: {
              title: 'New Contact Form Submission',
              message: `New message from ${name}: ${subject}`,
              type: 'CONTACT_SUBMISSION',
              userId: admin.id
            }
          })
        )
      )
      console.log('✅ Admin notifications created')
    } catch (notificationError) {
      console.warn('⚠️ Database notifications not available, creating fallback notification:', notificationError)
      
      // Create a fallback notification using the notifications API
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Contact Form Submission',
            message: `New message from ${name}: ${subject}`,
            type: 'CONTACT_SUBMISSION'
          })
        })
        console.log('✅ Fallback notification created')
      } catch (fallbackError) {
        console.warn('⚠️ Fallback notification failed:', fallbackError)
      }
    }

    // Send email notification to admin
    try {
      console.log('📧 Attempting to send admin notification email...')
      const transporter = createTransporter()
      
      const adminEmailOptions = {
        from: process.env.EMAIL_FROM || 'FreelanceHub <noreply@freelancehub.com>',
        to: 'sjay9327@gmail.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">FreelanceHub Contact Form</p>
            </div>
            
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Contact Details</h2>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                  <strong>Name:</strong> ${name}
                </p>
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                  <strong>Email:</strong> ${email}
                </p>
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                  <strong>Subject:</strong> ${subject}
                </p>
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
                  <strong>Message:</strong><br>
                  ${message.replace(/\n/g, '<br>')}
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/contacts" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 30px; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          font-size: 16px;
                          display: inline-block;">
                  View in Admin Dashboard
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

      await transporter.sendMail(adminEmailOptions)
      console.log('✅ Admin notification email sent successfully')
    } catch (emailError) {
      console.warn('⚠️ Email not configured or failed, continuing without email:', emailError)
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      console.log('📧 Attempting to send user confirmation email...')
      const transporter = createTransporter()
      
      const userEmailOptions = {
        from: process.env.EMAIL_FROM || 'FreelanceHub <noreply@freelancehub.com>',
        to: email,
        subject: 'Thank you for contacting FreelanceHub',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">We received your message</p>
            </div>
            
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}!</h2>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for reaching out to us! We've received your message and will get back to you within 24 hours.
              </p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                  <strong>Subject:</strong> ${subject}
                </p>
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
                  <strong>Your Message:</strong><br>
                  ${message.replace(/\n/g, '<br>')}
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                In the meantime, feel free to explore our platform and discover amazing freelance opportunities!
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

      await transporter.sendMail(userEmailOptions)
      console.log('✅ User confirmation email sent successfully')
    } catch (emailError) {
      console.warn('⚠️ User confirmation email not configured or failed, continuing without email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
        id: contactSubmission.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error processing contact form:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Unknown error') : 
          'Something went wrong'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    let contacts
    try {
      contacts = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
      })
    } catch (dbError) {
      console.warn('⚠️ Database not available for contacts, returning empty data:', dbError)
      contacts = []
    }

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
