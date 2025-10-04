#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MongoDB for FreelanceHub...\n');

// Step 1: Install MongoDB dependencies
console.log('📦 Installing MongoDB dependencies...');
try {
  execSync('npm install mongodb', { stdio: 'inherit' });
  console.log('✅ MongoDB driver installed\n');
} catch (error) {
  console.log('⚠️ MongoDB driver might already be installed\n');
}

// Step 2: Create environment file for MongoDB
console.log('🔧 Creating MongoDB environment configuration...');
const envContent = `
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/freelancehub

# Alternative MongoDB Atlas (Cloud) Configuration
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelancehub?retryWrites=true&w=majority

# Keep existing environment variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL="file:./dev.db"
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=FreelanceHub <noreply@freelancehub.com>
ADMIN_EMAIL=sjay9327@gmail.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_ROrn7ahgdd5X2d
RAZORPAY_KEY_SECRET=u8DBqFba66vdYLTLYXr0yDAh
RAZORPAY_ENVIRONMENT=live
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;

const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local with MongoDB configuration\n');
} else {
  console.log('⚠️ .env.local already exists, please add MongoDB configuration manually\n');
}

// Step 3: Create MongoDB seed script
console.log('🌱 Creating MongoDB seed script...');
const seedContent = `import { PrismaClient } from '@prisma/client'

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
`;

fs.writeFileSync(path.join(__dirname, 'prisma', 'seed-mongodb.ts'), seedContent);
console.log('✅ Created MongoDB seed script\n');

// Step 4: Create migration script
console.log('🔄 Creating migration script...');
const migrationContent = `#!/usr/bin/env node

const { PrismaClient: SQLiteClient } = require('@prisma/client');
const { PrismaClient: MongoDBClient } = require('@prisma/client');

const sqliteClient = new SQLiteClient();
const mongodbClient = new MongoDBClient();

async function migrateData() {
  console.log('🔄 Starting data migration from SQLite to MongoDB...');

  try {
    // Migrate users
    const users = await sqliteClient.user.findMany();
    for (const user of users) {
      await mongodbClient.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          rating: user.rating,
        },
      });
    }
    console.log(\`✅ Migrated \${users.length} users\`);

    // Migrate projects
    const projects = await sqliteClient.project.findMany();
    for (const project of projects) {
      await mongodbClient.project.create({
        data: {
          title: project.title,
          description: project.description,
          price: project.price,
          category: project.category,
          status: project.status,
          authorId: project.authorId,
        },
      });
    }
    console.log(\`✅ Migrated \${projects.length} projects\`);

    // Migrate contact submissions
    const contacts = await sqliteClient.contactSubmission.findMany();
    for (const contact of contacts) {
      await mongodbClient.contactSubmission.create({
        data: {
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          status: contact.status,
        },
      });
    }
    console.log(\`✅ Migrated \${contacts.length} contact submissions\`);

    console.log('🎉 Data migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sqliteClient.$disconnect();
    await mongodbClient.$disconnect();
  }
}

migrateData();
`;

fs.writeFileSync(path.join(__dirname, 'migrate-to-mongodb.js'), migrationContent);
console.log('✅ Created migration script\n');

console.log('🎉 MongoDB setup completed!\n');
console.log('📋 Next steps:');
console.log('1. Install MongoDB locally or use MongoDB Atlas (cloud)');
console.log('2. Update .env.local with your MongoDB connection string');
console.log('3. Replace schema.prisma with schema-mongodb.prisma');
console.log('4. Run: npx prisma generate');
console.log('5. Run: npx prisma db push');
console.log('6. Run: npx tsx prisma/seed-mongodb.ts');
console.log('\n🔗 MongoDB Resources:');
console.log('- Local MongoDB: https://docs.mongodb.com/manual/installation/');
console.log('- MongoDB Atlas: https://www.mongodb.com/atlas');
console.log('- Prisma MongoDB: https://www.prisma.io/docs/concepts/database-connectors/mongodb');
