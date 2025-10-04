#!/usr/bin/env node

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
    console.log(`✅ Migrated ${users.length} users`);

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
    console.log(`✅ Migrated ${projects.length} projects`);

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
    console.log(`✅ Migrated ${contacts.length} contact submissions`);

    console.log('🎉 Data migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sqliteClient.$disconnect();
    await mongodbClient.$disconnect();
  }
}

migrateData();
