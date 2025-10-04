import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const replySchema = z.object({
  message: z.string().min(1, 'Reply message is required')
})

// Create a transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password',
    },
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = replySchema.parse(body)

    // Get the contact details
    const contact = await prisma.contactSubmission.findUnique({
      where: { id: params.id }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Update contact status to REPLIED
    await prisma.contactSubmission.update({
      where: { id: params.id },
      data: {
        status: 'REPLIED',
        updatedAt: new Date()
      }
    })

    // Send reply email to the customer
    try {
      const transporter = createTransporter()
      
      const replyEmailOptions = {
        from: process.env.EMAIL_FROM || 'FreelanceHub <noreply@freelancehub.com>',
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Reply from FreelanceHub</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">We've received your message</p>
            </div>
            
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${contact.name}!</h2>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for contacting us! Here's our response to your inquiry:
              </p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
                  ${validatedData.message.replace(/\n/g, '<br>')}
                </p>
              </div>
              
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Your Original Message:</h3>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                  <strong>Subject:</strong> ${contact.subject}<br>
                  <strong>Message:</strong><br>
                  ${contact.message.replace(/\n/g, '<br>')}
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                If you have any further questions, please don't hesitate to contact us again!
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

      await transporter.sendMail(replyEmailOptions)
      console.log('✅ Reply email sent successfully to:', contact.email)
    } catch (emailError) {
      console.error('❌ Error sending reply email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Send reply error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
