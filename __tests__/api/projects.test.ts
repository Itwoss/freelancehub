import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/projects/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('returns projects successfully', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Test Project',
          description: 'Test Description',
          price: 100,
          category: 'Web Development',
          tags: ['React', 'Node.js'],
          images: [],
          featured: false,
          createdAt: new Date(),
          author: {
            id: '1',
            name: 'Test User',
            image: null,
            rating: 4.5
          },
          reviews: [],
          _count: {
            orders: 0,
            reviews: 0
          }
        }
      ]

      mockPrisma.project.findMany.mockResolvedValue(mockProjects)
      mockPrisma.project.count.mockResolvedValue(1)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/projects?page=1&limit=10',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.projects).toHaveLength(1)
      expect(data.pagination).toBeDefined()
    })

    it('filters projects by category', async () => {
      const mockProjects = []
      mockPrisma.project.findMany.mockResolvedValue(mockProjects)
      mockPrisma.project.count.mockResolvedValue(0)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/projects?category=Web Development',
      })

      await handler(req, res)

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'Web Development'
          })
        })
      )
    })

    it('searches projects by text', async () => {
      const mockProjects = []
      mockPrisma.project.findMany.mockResolvedValue(mockProjects)
      mockPrisma.project.count.mockResolvedValue(0)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/projects?search=react',
      })

      await handler(req, res)

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { title: { contains: 'react', mode: 'insensitive' } },
              { description: { contains: 'react', mode: 'insensitive' } },
              { tags: { has: 'react' } }
            ])
          })
        })
      )
    })
  })

  describe('POST /api/projects', () => {
    it('creates project successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'USER'
      }

      mockGetServerSession.mockResolvedValue({
        user: mockUser
      } as any)

      const mockProject = {
        id: '1',
        title: 'New Project',
        description: 'New Description',
        price: 200,
        category: 'Design',
        tags: ['Figma'],
        images: [],
        authorId: '1',
        status: 'ACTIVE',
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.project.create.mockResolvedValue(mockProject)

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          title: 'New Project',
          description: 'New Description',
          price: 200,
          category: 'Design',
          tags: ['Figma'],
          images: []
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.title).toBe('New Project')
    })

    it('returns 401 for unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          title: 'New Project',
          description: 'New Description',
          price: 200,
          category: 'Design'
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })

    it('validates required fields', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'USER'
      }

      mockGetServerSession.mockResolvedValue({
        user: mockUser
      } as any)

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          title: '',
          description: 'Short',
          price: -100,
          category: ''
        }
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Validation error')
    })
  })
})
