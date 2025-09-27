const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('🔐 Testing authentication...')
    
    // Test admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@freelancehub.com' }
    })
    
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.email)
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.password)
      console.log('🔑 Password verification:', isPasswordValid ? '✅ Valid' : '❌ Invalid')
    } else {
      console.log('❌ Admin user not found')
    }
    
    // Test demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'user@freelancehub.com' }
    })
    
    if (demoUser) {
      console.log('✅ Demo user found:', demoUser.email)
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('user123', demoUser.password)
      console.log('🔑 Password verification:', isPasswordValid ? '✅ Valid' : '❌ Invalid')
    } else {
      console.log('❌ Demo user not found')
    }
    
  } catch (error) {
    console.error('❌ Error testing auth:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
