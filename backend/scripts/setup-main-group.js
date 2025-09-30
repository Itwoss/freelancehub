const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupMainGroup() {
  try {
    console.log('🚀 Setting up main group system...')

    // Check if main group already exists
    const existingGroup = await prisma.chatRoom.findFirst({
      where: { name: 'Main Group' }
    })

    if (existingGroup) {
      console.log('✅ Main group already exists:', existingGroup.id)
      return
    }

    // Create main group
    const mainGroup = await prisma.chatRoom.create({
      data: {
        name: 'Main Group',
        type: 'GROUP'
      }
    })

    console.log('✅ Main group created:', mainGroup.id)

    // Get all users
    const users = await prisma.user.findMany()
    console.log(`👥 Found ${users.length} users to add to main group`)

    // Add all users to the main group
    const groupMembers = await Promise.all(
      users.map(user => 
        prisma.chatRoomMember.create({
          data: {
            userId: user.id,
            chatRoomId: mainGroup.id
          }
        })
      )
    )

    console.log(`✅ Added ${groupMembers.length} users to main group`)

    // Create welcome message from admin
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (admin) {
      await prisma.message.create({
        data: {
          content: 'Welcome to the main group! This is where important announcements and updates will be shared.',
          senderId: admin.id,
          chatRoomId: mainGroup.id,
          type: 'TEXT'
        }
      })
      console.log('✅ Welcome message created by admin')
    }

    console.log('🎉 Main group setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up main group:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupMainGroup()
