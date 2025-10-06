import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search } }
      ]
    }

    if (featured === 'true') {
      where.featured = true
    }

    const [products, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              rating: true,
            }
          },
          _count: {
            select: {
              reviews: true,
              orders: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.project.count({ where })
    ])

    // Parse JSON strings for tags and images
    const processedProducts = products.map(product => ({
      ...product,
      tags: product.tags ? JSON.parse(product.tags) : [],
      images: product.images ? JSON.parse(product.images) : []
    }))

    return NextResponse.json({
      products: processedProducts,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, price, category, tags, images } = body

    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Title, description, price, and category are required' },
        { status: 400 }
      )
    }

    const product = await prisma.project.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        tags: tags ? JSON.stringify(tags) : null,
        images: images ? JSON.stringify(images) : null,
        authorId: session.user.id,
        status: 'ACTIVE',
        featured: false
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Product created successfully',
      product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
