import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const productId = params.id

    // Check if user has purchased this product
    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        projectId: productId,
        status: 'COMPLETED'
      },
      include: {
        project: {
          select: {
            title: true,
            category: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Product not purchased or order not completed' },
        { status: 403 }
      )
    }

    // For demo purposes, create a sample download file
    // In production, you would serve the actual product files
    const sampleContent = `
# ${order.project.title}

Thank you for your purchase!

## Product Details
- Title: ${order.project.title}
- Category: ${order.project.category}
- Order ID: ${order.id}
- Purchase Date: ${new Date(order.createdAt).toLocaleDateString()}

## Installation Instructions
1. Extract the downloaded files
2. Follow the included README.md for setup instructions
3. Customize according to your needs

## Support
If you need any help, please contact our support team.

---
FreelanceHub Team
    `.trim()

    // Create a zip file content (simplified for demo)
    const zipContent = Buffer.from(sampleContent, 'utf-8')
    
    return new NextResponse(zipContent, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${order.project.title}.zip"`,
        'Content-Length': zipContent.length.toString()
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download product' },
      { status: 500 }
    )
  }
}
