import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
})

export async function GET(request: NextRequest) {
  try {
    // Mock data for development - no database required
    const mockProjects = [
      {
        id: '1',
        title: 'E-commerce Platform Development',
        description: 'Build a modern e-commerce platform with React, Node.js, and Stripe integration. Looking for a full-stack developer with e-commerce experience.',
        price: 2500,
        category: 'Web Development',
        tags: ['React', 'Node.js', 'Stripe'],
        images: ['/placeholder-image/ecommerce-1.jpg'],
        status: 'ACTIVE',
        featured: true,
        createdAt: new Date('2024-01-15'),
        author: {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          image: null,
          rating: 4.9
        },
        reviews: [{ rating: 5 }, { rating: 4 }],
        _count: {
          reviews: 2,
          orders: 1
        }
      },
      {
        id: '2',
        title: 'Mobile App Design',
        description: 'Design a sleek mobile app interface for a fitness tracking application. Need modern, intuitive design with excellent user experience.',
        price: 1200,
        category: 'UI/UX Design',
        tags: ['Figma', 'UI/UX', 'Mobile'],
        images: ['/placeholder-image/mobile-1.jpg'],
        status: 'ACTIVE',
        featured: true,
        createdAt: new Date('2024-01-14'),
        author: {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          image: null,
          rating: 4.8
        },
        reviews: [{ rating: 5 }, { rating: 4 }],
        _count: {
          reviews: 2,
          orders: 0
        }
      },
      {
        id: '3',
        title: 'Content Marketing Strategy',
        description: 'Create engaging content strategy and social media campaigns for a tech startup. Looking for creative marketer with startup experience.',
        price: 800,
        category: 'Marketing',
        tags: ['SEO', 'Social Media', 'Content'],
        images: ['/placeholder-image/marketing-1.jpg'],
        status: 'ACTIVE',
        featured: false,
        createdAt: new Date('2024-01-13'),
        author: {
          id: '3',
          name: 'Mike Davis',
          email: 'mike@example.com',
          image: null,
          rating: 4.7
        },
        reviews: [{ rating: 4 }],
        _count: {
          reviews: 1,
          orders: 0
        }
      }
    ]

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'

    let filteredProjects = mockProjects

    if (category) {
      filteredProjects = filteredProjects.filter(p => p.category === category)
    }

    if (search) {
      filteredProjects = filteredProjects.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (featured) {
      filteredProjects = filteredProjects.filter(p => p.featured)
    }

    const total = filteredProjects.length
    const skip = (page - 1) * limit
    const projects = filteredProjects.slice(skip, skip + limit)

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = createProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...data,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true
          }
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
