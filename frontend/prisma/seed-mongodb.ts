import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
  ])
  console.log('✅ Projects created:', projects.length)

  console.log('🎉 MongoDB database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: ${users.length + 1} (including admin)`)
  console.log(`- Projects: ${projects.length}`)
  console.log('\n🔑 Test Credentials:')
  console.log('Admin: admin@freelancehub.com / admin123')
  console.log('User: john@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding MongoDB database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
