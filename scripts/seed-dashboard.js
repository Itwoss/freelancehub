const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedDashboard() {
  try {
    console.log('🌱 Seeding dashboard data...')

    // Create admin user if not exists
    let admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@freelancehub.com',
          password: hashedPassword,
          role: 'ADMIN',
          bio: 'System Administrator',
          isVerified: true
        }
      })
      console.log('✅ Admin user created')
    }

    // Create sample users
    const sampleUsers = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        bio: 'UI/UX Designer',
        skills: ['Design', 'Figma', 'Adobe Creative Suite']
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        bio: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'TypeScript']
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        bio: 'Marketing Specialist',
        skills: ['Digital Marketing', 'SEO', 'Content Creation']
      },
      {
        name: 'Alex Thompson',
        email: 'alex@example.com',
        bio: 'Product Manager',
        skills: ['Product Strategy', 'Agile', 'User Research']
      }
    ]

    const users = []
    for (const userData of sampleUsers) {
      let user = await prisma.user.findFirst({
        where: { email: userData.email }
      })

      if (!user) {
        const hashedPassword = await bcrypt.hash('password123', 10)
        user = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
            role: 'USER',
            isVerified: true
          }
        })
        users.push(user)
      } else {
        users.push(user)
      }
    }

    console.log(`✅ ${users.length} sample users ready`)

    // Create sample stories
    const stories = []
    for (let i = 0; i < 5; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const story = await prisma.story.create({
        data: {
          content: `https://example.com/story-${i}.jpg`,
          type: Math.random() > 0.5 ? 'IMAGE' : 'VIDEO',
          authorId: randomUser.id,
          expiresAt,
          isPublic: true,
          isApproved: true,
          viewsCount: Math.floor(Math.random() * 100)
        }
      })
      stories.push(story)
    }

    console.log(`✅ ${stories.length} sample stories created`)

    // Create sample posts
    const posts = []
    const postTemplates = [
      {
        title: 'New Project Launch',
        caption: 'Excited to share our latest project! 🚀 #design #innovation',
        images: ['https://example.com/project1.jpg']
      },
      {
        title: 'Behind the Scenes',
        caption: 'Working on something amazing! Can\'t wait to show you all. 💪',
        images: ['https://example.com/behind-scenes.jpg']
      },
      {
        title: 'Team Collaboration',
        caption: 'Great session with the team today. Collaboration is key! 👥',
        images: ['https://example.com/team.jpg']
      },
      {
        title: 'Learning Journey',
        caption: 'Always learning something new. Here\'s what I discovered today! 📚',
        audioUrl: 'https://example.com/audio.mp3',
        audioTitle: 'Learning Podcast'
      },
      {
        title: 'Success Story',
        caption: 'Celebrating another milestone! Hard work pays off. 🎉',
        images: ['https://example.com/success.jpg']
      }
    ]

    for (let i = 0; i < 8; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const template = postTemplates[i % postTemplates.length]

      const post = await prisma.post.create({
        data: {
          title: template.title,
          caption: template.caption,
          images: template.images || [],
          audioUrl: template.audioUrl,
          audioTitle: template.audioTitle,
          authorId: randomUser.id,
          isPublic: true,
          isApproved: true,
          likesCount: Math.floor(Math.random() * 50),
          commentsCount: Math.floor(Math.random() * 20)
        }
      })
      posts.push(post)
    }

    console.log(`✅ ${posts.length} sample posts created`)

    // Create sample comments
    for (const post of posts.slice(0, 5)) {
      const commentCount = Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < commentCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        await prisma.comment.create({
          data: {
            content: [
              'Great work! 👏',
              'This is amazing!',
              'Love this approach',
              'Very inspiring!',
              'Keep it up!',
              'Excellent job',
              'This is helpful',
              'Thanks for sharing'
            ][Math.floor(Math.random() * 8)],
            authorId: randomUser.id,
            postId: post.id
          }
        })
      }
    }

    console.log('✅ Sample comments created')

    // Create main group and add all users
    let mainGroup = await prisma.chatRoom.findFirst({
      where: { name: 'Main Group' }
    })

    if (!mainGroup) {
      mainGroup = await prisma.chatRoom.create({
        data: {
          name: 'Main Group',
          type: 'GROUP'
        }
      })

      // Add all users to main group
      const allUsers = [admin, ...users]
      for (const user of allUsers) {
        await prisma.chatRoomMember.create({
          data: {
            userId: user.id,
            chatRoomId: mainGroup.id
          }
        })
      }

      // Create welcome message
      await prisma.message.create({
        data: {
          content: 'Welcome to the main group! This is where important announcements and updates will be shared.',
          senderId: admin.id,
          chatRoomId: mainGroup.id,
          type: 'TEXT'
        }
      })

      console.log('✅ Main group created and populated')
    }

    // Create some sample direct messages
    for (let i = 0; i < 3; i++) {
      const user1 = users[i]
      const user2 = users[(i + 1) % users.length]

      // Create direct chat room
      const directChat = await prisma.chatRoom.create({
        data: {
          type: 'DIRECT'
        }
      })

      // Add both users to chat
      await prisma.chatRoomMember.createMany({
        data: [
          { userId: user1.id, chatRoomId: directChat.id },
          { userId: user2.id, chatRoomId: directChat.id }
        ]
      })

      // Create some messages
      await prisma.message.createMany({
        data: [
          {
            content: 'Hey! How are you doing?',
            senderId: user1.id,
            chatRoomId: directChat.id,
            type: 'TEXT'
          },
          {
            content: 'I\'m doing great! Working on some exciting projects.',
            senderId: user2.id,
            chatRoomId: directChat.id,
            type: 'TEXT'
          },
          {
            content: 'That sounds awesome! Would love to hear more about it.',
            senderId: user1.id,
            chatRoomId: directChat.id,
            type: 'TEXT'
          }
        ]
      })
    }

    console.log('✅ Sample direct messages created')

    console.log('🎉 Dashboard seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Admin user: ${admin.email}`)
    console.log(`- Sample users: ${users.length}`)
    console.log(`- Stories: ${stories.length}`)
    console.log(`- Posts: ${posts.length}`)
    console.log(`- Main group: Created and populated`)
    console.log(`- Direct messages: 3 conversations`)

  } catch (error) {
    console.error('❌ Error seeding dashboard:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDashboard()
