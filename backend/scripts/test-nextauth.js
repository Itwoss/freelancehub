const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testNextAuth() {
  try {
    console.log('🔍 Testing NextAuth configuration...')
    
    // Simulate the exact same logic as in lib/auth.ts
    const credentials = {
      email: 'user@freelancehub.com',
      password: 'user123'
    }
    
    console.log('📧 Testing credentials:', credentials.email)
    
    if (!credentials?.email || !credentials?.password) {
      console.log('❌ Missing credentials')
      return
    }

    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email
      }
    })

    if (!user) {
      console.log('❌ User not found:', credentials.email)
      return
    }

    if (!user.password) {
      console.log('❌ User has no password set')
      return
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    )

    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', credentials.email)
      return
    }

    console.log('✅ Authentication successful for user:', user.email)
    
    const authResult = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    }
    
    console.log('✅ Auth result:', authResult)
    
  } catch (error) {
    console.error('❌ NextAuth test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNextAuth()

