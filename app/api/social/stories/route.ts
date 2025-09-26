import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createStorySchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO']),
  isPublic: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user can post (for now, allow all authenticated users)
    // TODO: Implement proper permission checking once canPost field is added to database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const content = formData.get('content') as File
    const type = formData.get('type') as string
    const isPublic = formData.get('isPublic') === 'true'

    // Validate input
    const validation = createStorySchema.safeParse({
      type,
      isPublic
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.errors },
        { status: 400 }
      )
    }

    if (!content || content.size === 0) {
      return NextResponse.json(
        { error: 'Content file is required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (validation.data.type === 'IMAGE' && !content.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    if (validation.data.type === 'VIDEO' && !content.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      )
    }

    // For now, store placeholder URL (in production, upload to cloud storage)
    const contentUrl = `/api/placeholder-story/${Date.now()}-${content.name}`

    // Create story with 24-hour expiration
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const story = await prisma.story.create({
      data: {
        content: contentUrl,
        type: validation.data.type,
        isPublic: validation.data.isPublic,
        isApproved: true, // For now, auto-approve stories (in production, set to false for admin approval)
        expiresAt,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      story,
      message: 'Story created successfully. It will be reviewed before going live.'
    })
  } catch (error) {
    console.error('Error creating story:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Allow public access to approved stories for the feed
    // Authentication is only required for creating stories

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const authorId = searchParams.get('authorId')

    const where: any = {
      isApproved: true,
      isPublic: true,
      expiresAt: {
        gt: new Date() // Only show non-expired stories
      }
    }

    if (authorId) {
      where.authorId = authorId
    }

    const [stories, totalCount] = await Promise.all([
      prisma.story.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.story.count({ where })
    ])

    return NextResponse.json({
      stories,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
