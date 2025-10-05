#!/bin/bash

# DigitalOcean Build Script for MongoDB Production

echo "🚀 Building FreelanceHub for DigitalOcean with MongoDB..."

# Set environment variables
export NODE_ENV=production
export PRISMA_SCHEMA_PATH=prisma/schema-mongodb.prisma

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client for MongoDB
echo "🔧 Generating Prisma client for MongoDB..."
npx prisma generate --schema=prisma/schema-mongodb.prisma

# Build Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
echo "🎯 Ready for deployment with MongoDB support"