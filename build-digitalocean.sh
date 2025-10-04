#!/bin/bash

# DigitalOcean Build Script - Frontend Only
echo "🚀 Starting DigitalOcean build process (Frontend Only)..."

# Set environment variables for build
export NODE_ENV=production

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Frontend build completed successfully!"
