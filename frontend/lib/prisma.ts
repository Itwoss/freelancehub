import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with error handling
let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || process.env.MONGODB_URI
      }
    }
  })
} catch (error) {
  console.warn('⚠️ Prisma client initialization failed:', error)
  // Create a mock client for build time
  prisma = {} as PrismaClient
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
