const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@freelancehub.com',
        password: hashedPassword,
        role: 'ADMIN',
        bio: 'System Administrator',
        isVerified: true
      }
    })

    console.log('✅ Admin user created successfully:')
    console.log('   Email: admin@freelancehub.com')
    console.log('   Password: admin123')
    console.log('   Role: ADMIN')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
