import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createPostSchema = z.object({
  title: z.string().optional(),
  caption: z.string().min(1, 'Caption is required'),
  isPublic: z.boolean().default(true),
  audioTitle: z.string().optional()
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
    const title = formData.get('title') as string
    const caption = formData.get('caption') as string
    const isPublic = formData.get('isPublic') === 'true'
    const audioTitle = formData.get('audioTitle') as string
    const audioFile = formData.get('audio') as File
    const imageFiles = formData.getAll('images') as File[]

    // Validate input
    const validation = createPostSchema.safeParse({
      title,
      caption,
      isPublic,
      audioTitle
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Validate files
    if (imageFiles.length === 0 && !audioFile) {
      return NextResponse.json(
        { error: 'At least one image or audio file is required' },
        { status: 400 }
      )
    }

    if (imageFiles.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      )
    }

    // For now, store placeholder URLs (in production, upload to cloud storage)
    const imageUrls: string[] = []
    let audioUrl: string | undefined

    // Process images
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        // Create a placeholder URL for now
        imageUrls.push(`/api/placeholder-image/${Date.now()}-${imageFile.name}`)
      }
    }

    // Process audio
    if (audioFile && audioFile.size > 0) {
      // Create a placeholder URL for now
      audioUrl = `/api/placeholder-audio/${Date.now()}-${audioFile.name}`
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: validation.data.title,
        caption: validation.data.caption,
        images: imageUrls,
        audioUrl,
        audioTitle: validation.data.audioTitle,
        isPublic: validation.data.isPublic,
        isApproved: true, // For now, auto-approve posts (in production, set to false for admin approval)
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
      post,
      message: 'Post created successfully. It will be reviewed before going live.'
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Allow public access to approved posts for the feed
    // Authentication is only required for creating posts

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const authorId = searchParams.get('authorId')

    const where: any = {
      isApproved: true,
      isPublic: true
    }

    if (authorId) {
      where.authorId = authorId
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          comments: {
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
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
