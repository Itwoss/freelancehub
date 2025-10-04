import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting MongoDB database seeding...')

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@freelancehub.com',
      role: 'ADMIN',
      bio: 'FreelanceHub Administrator',
      rating: 5.0,
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // Create regular users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john@example.com',
      role: 'USER',
      bio: 'Full-stack developer with 5+ years experience',
      rating: 4.8,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'USER',
      bio: 'UI/UX Designer specializing in modern web design',
      rating: 4.9,
    },
  })
  console.log('✅ Users created: 3')

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'E-commerce Platform Development',
      description: 'Build a modern e-commerce platform with React, Node.js, and Stripe integration.',
      price: 2500,
      category: 'Web Development',
      status: 'ACTIVE',
      authorId: user1.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Design',
      description: 'Design a sleek mobile app interface for a fitness tracking application.',
      price: 1200,
      category: 'UI/UX Design',
      status: 'ACTIVE',
      authorId: user2.id,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      title: 'Content Marketing Strategy',
      description: 'Create engaging content strategy and social media campaigns for a tech startup.',
      price: 800,
      category: 'Marketing',
      status: 'ACTIVE',
      authorId: user1.id,
    },
  })
  console.log('✅ Projects created: 3')

  // Create sample contact submissions
  const contact1 = await prisma.contactSubmission.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      subject: 'Website Development Inquiry',
      message: 'I am interested in your web development services. Could you please provide more information about your packages?',
      status: 'NEW',
    },
  })

  const contact2 = await prisma.contactSubmission.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      subject: 'Design Consultation',
      message: 'I need help with my brand identity design. Are you available for a consultation?',
      status: 'READ',
    },
  })

  const contact3 = await prisma.contactSubmission.create({
    data: {
      name: 'Carol Brown',
      email: 'carol@example.com',
      subject: 'Marketing Services',
      message: 'Looking for digital marketing services for my startup. Please contact me to discuss.',
      status: 'REPLIED',
    },
  })
  console.log('✅ Contact submissions created: 3')

  // Create sample notifications
  const notification1 = await prisma.notification.create({
    data: {
      title: 'Welcome to FreelanceHub!',
      message: 'Thank you for joining our platform. Start by creating your first project or browsing available opportunities.',
      type: 'GENERAL',
      read: false,
      userId: adminUser.id,
    },
  })

  const notification2 = await prisma.notification.create({
    data: {
      title: 'New Project Available',
      message: 'A new project matching your skills has been posted: E-commerce Platform Development',
      type: 'PROJECT_APPROVED',
      read: false,
      userId: user1.id,
    },
  })
  console.log('✅ Notifications created: 2')

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      totalAmount: 2500,
      status: 'COMPLETED',
      userId: adminUser.id,
      projectId: project1.id,
    },
  })

  const order2 = await prisma.order.create({
    data: {
      totalAmount: 1200,
      status: 'PAID',
      userId: adminUser.id,
      projectId: project2.id,
    },
  })
  console.log('✅ Orders created: 2')

  // Create sample reviews
  const review1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent work! Very professional and delivered on time.',
      reviewerId: adminUser.id,
      projectId: project1.id,
    },
  })

  const review2 = await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Good design, but took longer than expected.',
      reviewerId: adminUser.id,
      projectId: project2.id,
    },
  })
  console.log('✅ Reviews created: 2')

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: 'New Project Launch',
      caption: 'Just launched my latest e-commerce project! Check it out and let me know what you think.',
      isApproved: true,
      isPublic: true,
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Design Inspiration',
      caption: 'Working on some new UI designs. Here are some concepts I\'m exploring for mobile apps.',
      isApproved: true,
      isPublic: true,
      authorId: user2.id,
    },
  })
  console.log('✅ Posts created: 2')

  // Create sample prebookings
  const prebooking1 = await prisma.prebooking.create({
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
  })

  const prebooking2 = await prisma.prebooking.create({
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
      userId: user1.id,
    },
  })
  console.log('✅ Prebookings created: 2')

  console.log('🎉 MongoDB database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: 3 (including admin)`)
  console.log(`- Projects: 3`)
  console.log(`- Contact Submissions: 3`)
  console.log(`- Notifications: 2`)
  console.log(`- Orders: 2`)
  console.log(`- Reviews: 2`)
  console.log(`- Posts: 2`)
  console.log(`- Prebookings: 2`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding MongoDB database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
