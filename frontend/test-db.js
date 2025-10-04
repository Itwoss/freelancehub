const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test contact submissions
    const contacts = await prisma.contactSubmission.findMany()
    console.log('📞 Contact submissions:', contacts.length)
    if (contacts.length > 0) {
      console.log('First contact:', contacts[0])
    }
    
    // Test users
    const users = await prisma.user.findMany()
    console.log('👥 Users:', users.length)
    if (users.length > 0) {
      console.log('First user:', users[0].name, users[0].email)
    }
    
    // Test projects
    const projects = await prisma.project.findMany()
    console.log('📁 Projects:', projects.length)
    if (projects.length > 0) {
      console.log('First project:', projects[0].title)
    }
    
    console.log('✅ Database connection successful!')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
