const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function debugAuth() {
  try {
    console.log('🔍 Debugging authentication...')
    
    // Test specific user
    const testEmail = 'user@freelancehub.com'
    const testPassword = 'user123'
    
    console.log(`📧 Looking up user: ${testEmail}`)
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('✅ User found:')
    console.log(`  - ID: ${user.id}`)
    console.log(`  - Name: ${user.name}`)
    console.log(`  - Email: ${user.email}`)
    console.log(`  - Role: ${user.role}`)
    console.log(`  - Has Password: ${!!user.password}`)
    console.log(`  - Password Hash: ${user.password?.substring(0, 20)}...`)
    
    // Test password verification
    console.log(`🔐 Testing password: ${testPassword}`)
    const isPasswordValid = await bcrypt.compare(testPassword, user.password)
    console.log(`✅ Password verification: ${isPasswordValid ? 'PASSED' : 'FAILED'}`)
    
    // Test with different passwords
    const testPasswords = ['user123', 'password123', 'admin123', 'test123']
    for (const pwd of testPasswords) {
      const isValid = await bcrypt.compare(pwd, user.password)
      console.log(`  - Password "${pwd}": ${isValid ? '✅ VALID' : '❌ INVALID'}`)
    }
    
    // Check if there are any issues with the user record
    console.log('🔍 User record details:')
    console.log(`  - Created: ${user.createdAt}`)
    console.log(`  - Updated: ${user.updatedAt}`)
    console.log(`  - Bio: ${user.bio}`)
    console.log(`  - Skills: ${user.skills}`)
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugAuth()

