#!/bin/bash

# DigitalOcean Build Script
echo "🚀 Starting DigitalOcean build process..."

# Set environment variables for build
export NODE_ENV=production

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
