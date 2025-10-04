import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const { id, action } = params

    if (!id || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'activate':
        updateData.isActive = true
        break
      case 'deactivate':
        updateData.isActive = false
        break
      case 'suspend':
        updateData.isActive = false
        updateData.suspendedAt = new Date()
        break
      case 'unsuspend':
        updateData.isActive = true
        updateData.suspendedAt = null
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: `User ${action} successful`,
      user
    })
  } catch (error) {
    console.error(`Error ${params.action} user:`, error)
    return NextResponse.json(
      { error: `Failed to ${params.action} user` },
      { status: 500 }
    )
  }
}
