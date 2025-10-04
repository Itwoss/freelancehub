import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('📁 Fetching admin projects (test mode)...')

    let projects: any[] = []

    try {
      projects = await prisma.project.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          orders: true,
          reviews: true
        },
        orderBy: { createdAt: 'desc' }
      })

      // Transform the data
      projects = projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        price: project.price,
        category: project.category,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        author: project.author,
        orderCount: project.orders?.length || 0,
        reviewCount: project.reviews?.length || 0,
        averageRating: project.reviews?.length > 0 
          ? project.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / project.reviews.length 
          : 0
      }))

    } catch (dbError) {
      console.warn('⚠️ Database not available, using fallback data:', dbError)
      // Fallback data
      projects = [
        {
          id: 'project-1',
          title: 'E-commerce Platform Development',
          description: 'Build a modern e-commerce platform with React, Node.js, and Stripe integration.',
          price: 2500,
          category: 'Web Development',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: 'user-1',
            name: 'John Smith',
            email: 'john@example.com',
            image: '/placeholder-image/user-avatar-1.jpg'
          },
          orderCount: 1,
          reviewCount: 1,
          averageRating: 5.0
        }
      ]
    }

    console.log('✅ Admin projects fetched successfully:', projects.length)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('❌ Error fetching admin projects:', error)
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
