import { PrismaClient, OrderStatus, NotificationType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@freelancehub.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@freelancehub.com',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'Platform administrator',
      skills: ['Management', 'Administration', 'Platform Operations'],
      rating: 5.0,
      totalReviews: 1
    }
  })

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@freelancehub.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@freelancehub.com',
      password: userPassword,
      role: 'USER',
      bio: 'Experienced freelancer specializing in web development and design',
      skills: ['React', 'Node.js', 'TypeScript', 'UI/UX Design', 'PostgreSQL'],
      rating: 4.8,
      totalReviews: 15
    }
  })

  // Create additional users
  const freelancers = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      bio: 'Full-stack developer with 5+ years of experience',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
      rating: 4.9,
      totalReviews: 23
    },
    {
      name: 'Michael Chen',
      email: 'michael@example.com',
      bio: 'UI/UX designer passionate about creating beautiful user experiences',
      skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Research'],
      rating: 4.7,
      totalReviews: 18
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      bio: 'Digital marketing specialist helping businesses grow online',
      skills: ['SEO', 'Google Ads', 'Social Media', 'Content Marketing', 'Analytics'],
      rating: 4.6,
      totalReviews: 12
    },
    {
      name: 'David Wilson',
      email: 'david@example.com',
      bio: 'Mobile app developer creating innovative solutions',
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
      rating: 4.8,
      totalReviews: 20
    }
  ]

  const createdFreelancers = []
  for (const freelancer of freelancers) {
    const password = await bcrypt.hash('password123', 12)
    const created = await prisma.user.create({
      data: {
        ...freelancer,
        password,
        role: 'USER'
      }
    })
    createdFreelancers.push(created)
  }

  // Create sample projects
  const projects = [
    {
      title: 'E-commerce Website Development',
      description: 'I need a complete e-commerce website built with modern technologies. The site should include user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Looking for a clean, responsive design with excellent user experience.',
      price: 2500,
      category: 'Web Development',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'E-commerce'],
      images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'],
      authorId: user.id,
      featured: true
    },
    {
      title: 'Mobile App UI/UX Design',
      description: 'Design a modern, intuitive mobile app interface for a fitness tracking application. Need wireframes, mockups, and interactive prototypes. The design should be user-friendly and follow current design trends.',
      price: 1200,
      category: 'Design',
      tags: ['UI/UX', 'Figma', 'Mobile Design', 'Prototyping', 'User Experience'],
      images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800'],
      authorId: createdFreelancers[1].id,
      featured: true
    },
    {
      title: 'Digital Marketing Campaign',
      description: 'Develop and execute a comprehensive digital marketing strategy for a SaaS startup. Include SEO optimization, social media marketing, content creation, and paid advertising campaigns. Goal is to increase brand awareness and drive qualified leads.',
      price: 1800,
      category: 'Marketing',
      tags: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing', 'Google Ads'],
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
      authorId: createdFreelancers[2].id,
      featured: false
    },
    {
      title: 'React Native Mobile App',
      description: 'Build a cross-platform mobile application using React Native. The app should include user authentication, real-time chat, push notifications, and offline functionality. Looking for clean, maintainable code with proper documentation.',
      price: 3200,
      category: 'Mobile Development',
      tags: ['React Native', 'JavaScript', 'Firebase', 'Push Notifications', 'Offline Support'],
      images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'],
      authorId: createdFreelancers[3].id,
      featured: true
    },
    {
      title: 'WordPress Website Redesign',
      description: 'Redesign an existing WordPress website with a modern, professional look. Need to improve user experience, optimize for mobile devices, and enhance site performance. Should maintain SEO rankings while improving visual appeal.',
      price: 800,
      category: 'Web Development',
      tags: ['WordPress', 'PHP', 'CSS', 'JavaScript', 'SEO'],
      images: ['https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800'],
      authorId: createdFreelancers[0].id,
      featured: false
    },
    {
      title: 'Logo Design & Brand Identity',
      description: 'Create a complete brand identity package including logo design, color palette, typography, and brand guidelines. The brand should be modern, memorable, and suitable for a tech startup. Need multiple logo variations and usage guidelines.',
      price: 600,
      category: 'Design',
      tags: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Typography', 'Color Theory'],
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      authorId: createdFreelancers[1].id,
      featured: false
    }
  ]

  const createdProjects = []
  for (const project of projects) {
    const created = await prisma.project.create({
      data: project
    })
    createdProjects.push(created)
  }

  // Create sample orders
  const orders = [
    {
      buyerId: createdFreelancers[0].id,
      projectId: createdProjects[1].id,
      totalAmount: 1200,
      status: OrderStatus.COMPLETED,
      paymentId: 'pi_completed_1'
    },
    {
      buyerId: createdFreelancers[1].id,
      projectId: createdProjects[0].id,
      totalAmount: 2500,
      status: OrderStatus.PAID,
      paymentId: 'pi_paid_1'
    },
    {
      buyerId: createdFreelancers[2].id,
      projectId: createdProjects[3].id,
      totalAmount: 3200,
      status: OrderStatus.PENDING,
      paymentId: 'pi_pending_1'
    }
  ]

  const createdOrders = []
  for (const order of orders) {
    const created = await prisma.order.create({
      data: order
    })
    createdOrders.push(created)
  }

  // Create sample reviews
  const reviews = [
    {
      reviewerId: createdFreelancers[0].id,
      projectId: createdProjects[1].id,
      orderId: createdOrders[0].id,
      rating: 5,
      comment: 'Excellent work! The design exceeded my expectations. Very professional and delivered on time. Highly recommended!'
    },
    {
      reviewerId: createdFreelancers[1].id,
      projectId: createdProjects[0].id,
      orderId: createdOrders[1].id,
      rating: 4,
      comment: 'Great developer with excellent communication skills. The project was completed successfully with minor revisions needed.'
    }
  ]

  for (const review of reviews) {
    await prisma.review.create({
      data: review
    })
  }

  // Create sample notifications
  const notifications = [
    {
      userId: user.id,
      title: 'New Order Received',
      message: 'You have received a new order for "E-commerce Website Development"',
      type: NotificationType.ORDER_CREATED
    },
    {
      userId: createdFreelancers[0].id,
      title: 'Payment Received',
      message: 'Payment of $1,200 has been received for your project',
      type: NotificationType.PAYMENT_RECEIVED
    },
    {
      userId: createdFreelancers[1].id,
      title: 'New Review',
      message: 'You received a 5-star review for "Mobile App UI/UX Design"',
      type: NotificationType.REVIEW_RECEIVED
    }
  ]

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Demo Credentials:')
  console.log('Admin: admin@freelancehub.com / admin123')
  console.log('User: user@freelancehub.com / user123')
  console.log('\n👥 Additional Users:')
  console.log('Sarah: sarah@example.com / password123')
  console.log('Michael: michael@example.com / password123')
  console.log('Emily: emily@example.com / password123')
  console.log('David: david@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
