#!/usr/bin/env node

/**
 * Production Database Migration Script
 * Run this after setting up your PostgreSQL database on DigitalOcean
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting production database migration...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Create admin user if not exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@freelancehub.com' }
    })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@freelancehub.com',
          name: 'Admin User',
          hashedPassword: hashedPassword,
          role: 'ADMIN',
          bio: 'System Administrator',
          rating: 5.0
        }
      })
      
      console.log('✅ Admin user created:', admin.email)
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    // Create test user if not exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@freelancehub.com' }
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test123', 12)
      
      const user = await prisma.user.create({
        data: {
          email: 'test@freelancehub.com',
          name: 'Test User',
          hashedPassword: hashedPassword,
          role: 'USER',
          bio: 'Test user account',
          rating: 4.5
        }
      })
      
      console.log('✅ Test user created:', user.email)
    } else {
      console.log('ℹ️  Test user already exists')
    }

    // Get user count
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}`)

    console.log('🎉 Production database migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Migration error:', e)
    process.exit(1)
  })
