import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@freelancehub.com' },
    update: {},
    create: {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@freelancehub.com',
      hashedPassword: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
      bio: 'FreelanceHub Administrator',
      rating: 5.0,
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // Create regular users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        id: 'user-1',
        name: 'John Smith',
        email: 'john@example.com',
        hashedPassword: await bcrypt.hash('password123', 12),
        role: 'USER',
        bio: 'Full-stack developer with 5+ years experience',
        rating: 4.8,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        hashedPassword: await bcrypt.hash('password123', 12),
        role: 'USER',
        bio: 'UI/UX Designer specializing in modern web design',
        rating: 4.9,
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        id: 'user-3',
        name: 'Mike Davis',
        email: 'mike@example.com',
        hashedPassword: await bcrypt.hash('password123', 12),
        role: 'USER',
        bio: 'Digital marketing expert and content creator',
        rating: 4.7,
      },
    }),
  ])
  console.log('✅ Users created:', users.length)

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'E-commerce Platform Development',
        description: 'Build a modern e-commerce platform with React, Node.js, and Stripe integration. Looking for a full-stack developer with e-commerce experience.',
        price: 2500,
        category: 'Web Development',
        status: 'ACTIVE',
        authorId: users[0].id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Mobile App Design',
        description: 'Design a sleek mobile app interface for a fitness tracking application. Need modern, intuitive design with excellent user experience.',
        price: 1200,
        category: 'UI/UX Design',
        status: 'ACTIVE',
        authorId: users[1].id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Content Marketing Strategy',
        description: 'Create engaging content strategy and social media campaigns for a tech startup. Looking for creative marketer with startup experience.',
        price: 800,
        category: 'Marketing',
        status: 'ACTIVE',
        authorId: users[2].id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'WordPress Website Development',
        description: 'Create a professional WordPress website for a local business. Need custom theme development and SEO optimization.',
        price: 1500,
        category: 'Web Development',
        status: 'ACTIVE',
        authorId: users[0].id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Logo Design Package',
        description: 'Design a complete brand identity including logo, business cards, and letterhead for a new restaurant.',
        price: 500,
        category: 'Graphic Design',
        status: 'ACTIVE',
        authorId: users[1].id,
      },
    }),
  ])
  console.log('✅ Projects created:', projects.length)

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        totalAmount: 2500,
        status: 'COMPLETED',
        userId: adminUser.id,
        projectId: projects[0].id,
      },
    }),
    prisma.order.create({
      data: {
        totalAmount: 1200,
        status: 'PAID',
        userId: adminUser.id,
        projectId: projects[1].id,
      },
    }),
  ])
  console.log('✅ Orders created:', orders.length)

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excellent work! Very professional and delivered on time.',
        reviewerId: adminUser.id,
        projectId: projects[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Good design, but took longer than expected.',
        reviewerId: adminUser.id,
        projectId: projects[1].id,
      },
    }),
  ])
  console.log('✅ Reviews created:', reviews.length)

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'New Project Launch',
        caption: 'Just launched my latest e-commerce project! Check it out and let me know what you think.',
        isApproved: true,
        isPublic: true,
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Design Inspiration',
        caption: 'Working on some new UI designs. Here are some concepts I\'m exploring for mobile apps.',
        isApproved: true,
        isPublic: true,
        authorId: users[1].id,
      },
    }),
  ])
  console.log('✅ Posts created:', posts.length)

  // Create sample stories
  const stories = await Promise.all([
    prisma.story.create({
      data: {
        content: 'Behind the scenes of my latest project',
        type: 'IMAGE',
        isApproved: true,
        isPublic: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        authorId: users[0].id,
      },
    }),
    prisma.story.create({
      data: {
        content: 'Quick design tip for better user experience',
        type: 'VIDEO',
        isApproved: true,
        isPublic: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        authorId: users[1].id,
      },
    }),
  ])
  console.log('✅ Stories created:', stories.length)

  // Create sample notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Welcome to FreelanceHub!',
        message: 'Thank you for joining our platform. Start by creating your first project or browsing available opportunities.',
        type: 'GENERAL',
        read: false,
        userId: adminUser.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'New Project Available',
        message: 'A new project matching your skills has been posted: E-commerce Platform Development',
        type: 'PROJECT_APPROVED',
        read: false,
        userId: users[0].id,
      },
    }),
  ])
  console.log('✅ Notifications created:', notifications.length)

  // Create sample contact submissions
  const contacts = await Promise.all([
    prisma.contactSubmission.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'Website Development Inquiry',
        message: 'I am interested in your web development services. Could you please provide more information about your packages?',
        status: 'NEW',
      },
    }),
    prisma.contactSubmission.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        subject: 'Design Consultation',
        message: 'I need help with my brand identity design. Are you available for a consultation?',
        status: 'READ',
      },
    }),
    prisma.contactSubmission.create({
      data: {
        name: 'Carol Brown',
        email: 'carol@example.com',
        subject: 'Marketing Services',
        message: 'Looking for digital marketing services for my startup. Please contact me to discuss.',
        status: 'REPLIED',
      },
    }),
  ])
  console.log('✅ Contact submissions created:', contacts.length)

  // Create sample transactions
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        amount: 100,
        type: 'COIN_PURCHASE',
        status: 'COMPLETED',
        description: 'Purchased 100 coins',
        userId: adminUser.id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 50,
        type: 'MESSAGE_PURCHASE',
        status: 'COMPLETED',
        description: 'Purchased premium messaging',
        userId: users[0].id,
      },
    }),
  ])
  console.log('✅ Transactions created:', transactions.length)

  // Create sample prebookings
  const prebookings = await Promise.all([
    prisma.prebooking.create({
      data: {
        productId: 'website-package-1',
        productTitle: 'Website Development Package',
        userDetails: JSON.stringify({
          name: 'David Lee',
          email: 'david@example.com',
          phone: '+1234567890',
          message: 'Interested in the basic website package'
        }),
        amount: 1,
        currency: 'INR',
        status: 'PAID',
        paymentId: 'pay_123456789',
        orderId: 'order_123456789',
        receipt: 'receipt_123456789',
        userId: adminUser.id,
      },
    }),
    prisma.prebooking.create({
      data: {
        productId: 'design-package-1',
        productTitle: 'Logo Design Package',
        userDetails: JSON.stringify({
          name: 'Emma Wilson',
          email: 'emma@example.com',
          phone: '+0987654321',
          message: 'Need logo design for my new business'
        }),
        amount: 1,
        currency: 'INR',
        status: 'PENDING',
        userId: users[1].id,
      },
    }),
  ])
  console.log('✅ Prebookings created:', prebookings.length)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: ${users.length + 1} (including admin)`)
  console.log(`- Projects: ${projects.length}`)
  console.log(`- Orders: ${orders.length}`)
  console.log(`- Reviews: ${reviews.length}`)
  console.log(`- Posts: ${posts.length}`)
  console.log(`- Stories: ${stories.length}`)
  console.log(`- Notifications: ${notifications.length}`)
  console.log(`- Contact Submissions: ${contacts.length}`)
  console.log(`- Transactions: ${transactions.length}`)
  console.log(`- Prebookings: ${prebookings.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })