#!/bin/bash

# Vercel Build Script for Freelance Marketplace
echo "🚀 Starting Vercel build process..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
