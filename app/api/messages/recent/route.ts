import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent messages from chat rooms where user is a member
    const messages = await prisma.message.findMany({
      where: {
        chatRoom: {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        chatRoom: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching recent messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
