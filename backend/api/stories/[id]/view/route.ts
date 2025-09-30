import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const storyId = params.id

    // Increment view count
    const story = await prisma.story.update({
      where: { id: storyId },
      data: {
        viewsCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true, viewsCount: story.viewsCount })
  } catch (error) {
    console.error('Error viewing story:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
