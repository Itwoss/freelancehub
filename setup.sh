#!/bin/bash

echo "🚀 Setting up Freelance Marketplace..."

# Set environment variables
export DATABASE_URL="postgresql://itwosin@localhost:5432/freelance_marketplace"

# Run database migration
echo "📊 Running database migration..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Setup complete! You can now run 'npm run dev' to start the application."


