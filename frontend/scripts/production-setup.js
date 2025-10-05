#!/usr/bin/env node

/**
 * Production Setup Script for DigitalOcean Deployment
 * This script helps set up the database and admin user in production
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupProduction() {
  try {
    console.log('🚀 Setting up production environment...')
    
    // Test database connection
    console.log('📊 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if admin user exists
    console.log('👤 Checking for admin user...')
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
    } else {
      console.log('🔧 Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          hashedPassword,
          role: 'ADMIN',
          bio: 'System Administrator',
          rating: 5.0
        }
      })
      
      console.log('✅ Admin user created:', admin.email)
      console.log('🔐 Admin credentials:')
      console.log('   Email: admin@example.com')
      console.log('   Password: admin123')
    }
    
    // Check database schema
    console.log('📋 Checking database schema...')
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    const prebookingCount = await prisma.prebooking.count()
    
    console.log('📊 Database statistics:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Orders: ${orderCount}`)
    console.log(`   Prebookings: ${prebookingCount}`)
    
    console.log('🎉 Production setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Production setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the setup
setupProduction()
