import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting MongoDB database seeding...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@freelancehub.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@freelancehub.com',
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
        name: 'John Smith',
        email: 'john@example.com',
        role: 'USER',
        bio: 'Full-stack developer with 5+ years experience',
        rating: 4.8,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'USER',
        bio: 'UI/UX Designer specializing in modern web design',
        rating: 4.9,
      },
    }),
  ])
  console.log('✅ Users created:', users.length)

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'E-commerce Platform Development',
        description: 'Build a modern e-commerce platform with React, Node.js, and Stripe integration.',
        price: 2500,
        category: 'Web Development',
        status: 'ACTIVE',
        authorId: users[0].id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Mobile App Design',
        description: 'Design a sleek mobile app interface for a fitness tracking application.',
        price: 1200,
        category: 'UI/UX Design',
        status: 'ACTIVE',
        authorId: users[1].id,
      },
    }),
  ])
  console.log('✅ Projects created:', projects.length)

  // Create sample contact submissions
  const contacts = await Promise.all([
    prisma.contactSubmission.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'Website Development Inquiry',
        message: 'I am interested in your web development services.',
        status: 'NEW',
      },
    }),
    prisma.contactSubmission.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        subject: 'Design Consultation',
        message: 'I need help with my brand identity design.',
        status: 'READ',
      },
    }),
  ])
  console.log('✅ Contact submissions created:', contacts.length)

  console.log('🎉 MongoDB database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding MongoDB database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
