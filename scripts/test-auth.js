const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('🔍 Testing authentication...')
    
    // Test database connection
    console.log('📊 Testing database connection...')
    const userCount = await prisma.user.count()
    console.log(`✅ Database connected. Found ${userCount} users.`)
    
    // Test user lookup
    console.log('👤 Testing user lookup...')
    const testEmail = 'user@freelancehub.com'
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (!user) {
      console.log('❌ Test user not found. Creating test user...')
      
      const hashedPassword = await bcrypt.hash('user123', 12)
      const newUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: testEmail,
          password: hashedPassword,
          role: 'USER',
          bio: 'Test user for authentication',
          skills: ['Testing']
        }
      })
      console.log('✅ Test user created:', newUser.email)
    } else {
      console.log('✅ Test user found:', user.email)
      console.log('📧 User has password:', !!user.password)
      console.log('👤 User role:', user.role)
    }
    
    // Test password verification
    console.log('🔐 Testing password verification...')
    const testPassword = 'user123'
    const isPasswordValid = await bcrypt.compare(testPassword, user.password)
    console.log('✅ Password verification:', isPasswordValid ? 'PASSED' : 'FAILED')
    
    // List all users
    console.log('📋 All users in database:')
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true
      }
    })
    
    allUsers.forEach(u => {
      console.log(`  - ${u.name} (${u.email}) - Role: ${u.role} - Has Password: ${!!u.password}`)
    })
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()