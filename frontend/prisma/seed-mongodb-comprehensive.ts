import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive MongoDB database seeding...')

  try {
    // 1. Create Admin User
    console.log('👤 Creating admin user...')
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@freelancehub.com',
        role: 'ADMIN',
        bio: 'FreelanceHub Platform Administrator',
        rating: 5.0,
        image: '/placeholder-image/admin-avatar.jpg',
      },
    })
    console.log('✅ Admin user created:', adminUser.email)

    // 2. Create Regular Users
    console.log('👥 Creating regular users...')
    const users = []
    
    const user1 = await prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        role: 'USER',
        bio: 'Full-stack developer with 5+ years experience in React, Node.js, and MongoDB',
        rating: 4.8,
        image: '/placeholder-image/user-avatar-1.jpg',
      },
    })
    users.push(user1)

    const user2 = await prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'USER',
        bio: 'UI/UX Designer specializing in modern web and mobile app design',
        rating: 4.9,
        image: '/placeholder-image/user-avatar-2.jpg',
      },
    })
    users.push(user2)

    const user3 = await prisma.user.create({
      data: {
        name: 'Mike Davis',
        email: 'mike@example.com',
        role: 'USER',
        bio: 'Digital marketing expert with focus on SEO, content strategy, and social media',
        rating: 4.7,
        image: '/placeholder-image/user-avatar-3.jpg',
      },
    })
    users.push(user3)

    const user4 = await prisma.user.create({
      data: {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        role: 'USER',
        bio: 'Graphic designer and brand identity specialist',
        rating: 4.6,
        image: '/placeholder-image/user-avatar-4.jpg',
      },
    })
    users.push(user4)

    console.log('✅ Users created:', users.length + 1)

    // 3. Create Projects
    console.log('📁 Creating projects...')
    const projects = []
    
    const project1 = await prisma.project.create({
      data: {
        title: 'E-commerce Platform Development',
        description: 'Build a modern e-commerce platform with React, Node.js, and Stripe integration. Looking for a full-stack developer with e-commerce experience.',
        price: 2500.00,
        category: 'Web Development',
        status: 'ACTIVE',
        authorId: user1.id,
      },
    })
    projects.push(project1)

    const project2 = await prisma.project.create({
      data: {
        title: 'Mobile App Design',
        description: 'Design a sleek mobile app interface for a fitness tracking application. Need modern, intuitive design with excellent user experience.',
        price: 1200.00,
        category: 'UI/UX Design',
        status: 'ACTIVE',
        authorId: user2.id,
      },
    })
    projects.push(project2)

    const project3 = await prisma.project.create({
      data: {
        title: 'Content Marketing Strategy',
        description: 'Create engaging content strategy and social media campaigns for a tech startup. Looking for creative marketer with startup experience.',
        price: 800.00,
        category: 'Marketing',
        status: 'ACTIVE',
        authorId: user3.id,
      },
    })
    projects.push(project3)

    const project4 = await prisma.project.create({
      data: {
        title: 'Logo Design Package',
        description: 'Comprehensive logo design package including multiple concepts, revisions, and final files in various formats.',
        price: 500.00,
        category: 'Graphic Design',
        status: 'ACTIVE',
        authorId: user4.id,
      },
    })
    projects.push(project4)

    const project5 = await prisma.project.create({
      data: {
        title: 'WordPress Website Development',
        description: 'Develop a responsive WordPress website for a small business, including custom theme and plugin integration.',
        price: 1500.00,
        category: 'Web Development',
        status: 'COMPLETED',
        authorId: user1.id,
      },
    })
    projects.push(project5)

    console.log('✅ Projects created:', projects.length)

    // 4. Create Orders
    console.log('🛒 Creating orders...')
    const orders = []
    
    const order1 = await prisma.order.create({
      data: {
        totalAmount: 2500.00,
        status: 'COMPLETED',
        userId: adminUser.id,
        projectId: project1.id,
      },
    })
    orders.push(order1)

    const order2 = await prisma.order.create({
      data: {
        totalAmount: 1200.00,
        status: 'PAID',
        userId: adminUser.id,
        projectId: project2.id,
      },
    })
    orders.push(order2)

    const order3 = await prisma.order.create({
      data: {
        totalAmount: 800.00,
        status: 'PENDING',
        userId: user1.id,
        projectId: project3.id,
      },
    })
    orders.push(order3)

    console.log('✅ Orders created:', orders.length)

    // 5. Create Reviews
    console.log('⭐ Creating reviews...')
    const reviews = []
    
    const review1 = await prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excellent work! Very professional and delivered on time. Highly recommended!',
        reviewerId: adminUser.id,
        projectId: project1.id,
      },
    })
    reviews.push(review1)

    const review2 = await prisma.review.create({
      data: {
        rating: 4,
        comment: 'Good design, but took longer than expected. Overall satisfied with the result.',
        reviewerId: adminUser.id,
        projectId: project2.id,
      },
    })
    reviews.push(review2)

    const review3 = await prisma.review.create({
      data: {
        rating: 5,
        comment: 'Outstanding marketing strategy! Our engagement increased by 300%.',
        reviewerId: user1.id,
        projectId: project3.id,
      },
    })
    reviews.push(review3)

    console.log('✅ Reviews created:', reviews.length)

    // 6. Create Contact Submissions
    console.log('📞 Creating contact submissions...')
    const contacts = []
    
    const contact1 = await prisma.contactSubmission.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'Website Development Inquiry',
        message: 'I am interested in your web development services. Could you please provide more information about your packages and pricing?',
        status: 'NEW',
      },
    })
    contacts.push(contact1)

    const contact2 = await prisma.contactSubmission.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        subject: 'Design Consultation',
        message: 'I need help with my brand identity design. Are you available for a consultation this week?',
        status: 'READ',
      },
    })
    contacts.push(contact2)

    const contact3 = await prisma.contactSubmission.create({
      data: {
        name: 'Carol Brown',
        email: 'carol@example.com',
        subject: 'Marketing Services',
        message: 'Looking for digital marketing services for my startup. Please contact me to discuss our requirements.',
        status: 'REPLIED',
      },
    })
    contacts.push(contact3)

    const contact4 = await prisma.contactSubmission.create({
      data: {
        name: 'David Lee',
        email: 'david@example.com',
        subject: 'Logo Design Request',
        message: 'I need a professional logo for my new business. What are your rates and timeline?',
        status: 'NEW',
      },
    })
    contacts.push(contact4)

    console.log('✅ Contact submissions created:', contacts.length)

    // 7. Create Notifications
    console.log('🔔 Creating notifications...')
    const notifications = []
    
    const notification1 = await prisma.notification.create({
      data: {
        title: 'Welcome to FreelanceHub!',
        message: 'Thank you for joining our platform. Start by creating your first project or browsing available opportunities.',
        type: 'GENERAL',
        read: false,
        userId: adminUser.id,
      },
    })
    notifications.push(notification1)

    const notification2 = await prisma.notification.create({
      data: {
        title: 'New Project Available',
        message: 'A new project matching your skills has been posted: E-commerce Platform Development',
        type: 'PROJECT_APPROVED',
        read: false,
        userId: user1.id,
      },
    })
    notifications.push(notification2)

    const notification3 = await prisma.notification.create({
      data: {
        title: 'New Contact Form Submission',
        message: 'New message from Alice Johnson: Website Development Inquiry',
        type: 'CONTACT_SUBMISSION',
        read: false,
        userId: adminUser.id,
      },
    })
    notifications.push(notification3)

    const notification4 = await prisma.notification.create({
      data: {
        title: 'Payment Received',
        message: 'Payment of ₹2,500 received for E-commerce Platform Development project',
        type: 'PAYMENT_RECEIVED',
        read: true,
        userId: user1.id,
      },
    })
    notifications.push(notification4)

    console.log('✅ Notifications created:', notifications.length)

    // 8. Create Posts
    console.log('📝 Creating posts...')
    const posts = []
    
    const post1 = await prisma.post.create({
      data: {
        title: 'Building Scalable E-commerce Backends',
        caption: 'Sharing insights on building robust and scalable e-commerce backends using Node.js and microservices architecture.',
        isApproved: true,
        isPublic: true,
        authorId: user1.id,
      },
    })
    posts.push(post1)

    const post2 = await prisma.post.create({
      data: {
        title: 'The Art of Minimalist UI Design',
        caption: 'Exploring the principles of minimalist UI design and how it enhances user experience. Less is more!',
        isApproved: true,
        isPublic: true,
        authorId: user2.id,
      },
    })
    posts.push(post2)

    const post3 = await prisma.post.create({
      data: {
        title: 'Content Marketing Trends 2024',
        caption: 'Latest trends in content marketing and how to leverage them for better engagement and ROI.',
        isApproved: true,
        isPublic: true,
        authorId: user3.id,
      },
    })
    posts.push(post3)

    console.log('✅ Posts created:', posts.length)

    // 9. Create Stories
    console.log('📸 Creating stories...')
    const stories = []
    
    const story1 = await prisma.story.create({
      data: {
        content: '/placeholder-story/story-image-1.jpg',
        type: 'IMAGE',
        isApproved: true,
        isPublic: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        authorId: user2.id,
      },
    })
    stories.push(story1)

    const story2 = await prisma.story.create({
      data: {
        content: '/placeholder-story/story-video-1.mp4',
        type: 'VIDEO',
        isApproved: true,
        isPublic: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        authorId: user1.id,
      },
    })
    stories.push(story2)

    console.log('✅ Stories created:', stories.length)

    // 10. Create Prebookings
    console.log('📋 Creating prebookings...')
    const prebookings = []
    
    const prebooking1 = await prisma.prebooking.create({
      data: {
        productId: 'website-package-1',
        productTitle: 'Website Development Package',
        userDetails: JSON.stringify({
          name: 'David Lee',
          email: 'david@example.com',
          phone: '+1234567890',
          message: 'Interested in the basic website package',
          requirements: 'Responsive design, SEO optimization'
        }),
        amount: 1.00,
        currency: 'INR',
        status: 'PAID',
        paymentId: 'pay_123456789',
        orderId: 'order_123456789',
        receipt: 'receipt_123456789',
        userId: adminUser.id,
      },
    })
    prebookings.push(prebooking1)

    const prebooking2 = await prisma.prebooking.create({
      data: {
        productId: 'design-package-1',
        productTitle: 'Logo Design Package',
        userDetails: JSON.stringify({
          name: 'Emma Wilson',
          email: 'emma@example.com',
          phone: '+0987654321',
          message: 'Need logo design for my new business',
          brand: 'Tech startup in fintech'
        }),
        amount: 1.00,
        currency: 'INR',
        status: 'PENDING',
        userId: user1.id,
      },
    })
    prebookings.push(prebooking2)

    const prebooking3 = await prisma.prebooking.create({
      data: {
        productId: 'marketing-package-1',
        productTitle: 'Digital Marketing Package',
        userDetails: JSON.stringify({
          name: 'Frank Miller',
          email: 'frank@example.com',
          phone: '+1122334455',
          message: 'Looking for comprehensive digital marketing strategy',
          industry: 'E-commerce'
        }),
        amount: 1.00,
        currency: 'INR',
        status: 'COMPLETED',
        paymentId: 'pay_987654321',
        orderId: 'order_987654321',
        receipt: 'receipt_987654321',
        userId: user2.id,
      },
    })
    prebookings.push(prebooking3)

    console.log('✅ Prebookings created:', prebookings.length)

    // 11. Create Transactions
    console.log('💰 Creating transactions...')
    const transactions = []
    
    const transaction1 = await prisma.transaction.create({
      data: {
        amount: 500.00,
        type: 'COIN_PURCHASE',
        status: 'COMPLETED',
        description: 'Purchased 500 coins for project bidding',
        userId: user1.id,
      },
    })
    transactions.push(transaction1)

    const transaction2 = await prisma.transaction.create({
      data: {
        amount: 100.00,
        type: 'MESSAGE_PURCHASE',
        status: 'PENDING',
        description: 'Purchased message credits for communication',
        userId: user2.id,
      },
    })
    transactions.push(transaction2)

    console.log('✅ Transactions created:', transactions.length)

    console.log('\n🎉 MongoDB database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Users: ${users.length + 1} (including admin)`)
    console.log(`- Projects: ${projects.length}`)
    console.log(`- Orders: ${orders.length}`)
    console.log(`- Reviews: ${reviews.length}`)
    console.log(`- Contact Submissions: ${contacts.length}`)
    console.log(`- Notifications: ${notifications.length}`)
    console.log(`- Posts: ${posts.length}`)
    console.log(`- Stories: ${stories.length}`)
    console.log(`- Prebookings: ${prebookings.length}`)
    console.log(`- Transactions: ${transactions.length}`)
    
    console.log('\n🚀 Your FreelanceHub MongoDB database is now ready for testing!')
    console.log('\n🔗 Test your application:')
    console.log('- Admin Dashboard: http://localhost:3000/admin/dashboard')
    console.log('- User Dashboard: http://localhost:3000/dashboard')
    console.log('- Contact Form: http://localhost:3000/contact')
    console.log('- Products: http://localhost:3000/products')

  } catch (error) {
    console.error('❌ Error seeding MongoDB database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
