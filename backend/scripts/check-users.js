const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkAndCreateUsers() {
  try {
    console.log('🔍 Checking existing users...')
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@freelancehub.com' }
    })
    
    if (!adminUser) {
      console.log('👤 Creating admin user...')
      const adminPassword = await bcrypt.hash('admin123', 12)
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@freelancehub.com',
          password: adminPassword,
          role: 'ADMIN',
          bio: 'Platform administrator',
          skills: ['Management', 'Administration'],
          rating: 5.0,
          totalReviews: 1
        }
      })
      console.log('✅ Admin user created')
    } else {
      console.log('✅ Admin user already exists')
    }
    
    // Check if demo user exists
    const demoUser = await prisma.user.findUnique({
      where: { email: 'user@freelancehub.com' }
    })
    
    if (!demoUser) {
      console.log('👤 Creating demo user...')
      const userPassword = await bcrypt.hash('user123', 12)
      await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'user@freelancehub.com',
          password: userPassword,
          role: 'USER',
          bio: 'Demo user for testing',
          skills: ['React', 'Node.js', 'TypeScript'],
          rating: 4.8,
          totalReviews: 15
        }
      })
      console.log('✅ Demo user created')
    } else {
      console.log('✅ Demo user already exists')
    }
    
    console.log('\n📋 Available credentials:')
    console.log('Admin: admin@freelancehub.com / admin123')
    console.log('User: user@freelancehub.com / user123')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndCreateUsers()
