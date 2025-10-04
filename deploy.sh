#!/bin/bash

# 🚀 Deployment Script for FreelanceHub
# This script helps deploy your Next.js app to various platforms

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to deploy to Vercel
deploy_vercel() {
    echo "📦 Deploying to Vercel..."
    
    # Install Vercel CLI if not installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Navigate to frontend directory
    cd frontend
    
    # Deploy to Vercel
    vercel --prod
    
    echo "✅ Vercel deployment completed!"
    echo "🌐 Your app should be live at the provided URL"
}

# Function to deploy to Netlify
deploy_netlify() {
    echo "📦 Deploying to Netlify..."
    
    # Install Netlify CLI if not installed
    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    # Navigate to frontend directory
    cd frontend
    
    # Build the project
    npm run build
    
    # Deploy to Netlify
    netlify deploy --prod --dir=.next
    
    echo "✅ Netlify deployment completed!"
    echo "🌐 Your app should be live at the provided URL"
}

# Function to build for production
build_production() {
    echo "🔨 Building for production..."
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm run install:all
    
    # Build frontend
    echo "🏗️ Building frontend..."
    npm run build:frontend
    
    echo "✅ Production build completed!"
    echo "📁 Built files are in the frontend/.next directory"
}

# Function to setup environment variables
setup_env() {
    echo "⚙️ Setting up environment variables..."
    
    # Copy example environment file
    if [ ! -f "frontend/.env.local" ]; then
        cp env.production.example frontend/.env.local
        echo "📝 Created .env.local file. Please update with your production values."
    fi
    
    echo "✅ Environment setup completed!"
    echo "📝 Please update frontend/.env.local with your production values"
}

# Function to test deployment
test_deployment() {
    echo "🧪 Testing deployment..."
    
    # Start the production server
    cd frontend
    npm run start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Test if server is running
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Deployment test successful!"
    else
        echo "❌ Deployment test failed!"
    fi
    
    # Stop the server
    kill $SERVER_PID
}

# Main menu
echo "🎯 Choose your deployment option:"
echo "1) Deploy to Vercel (Recommended)"
echo "2) Deploy to Netlify"
echo "3) Build for production"
echo "4) Setup environment variables"
echo "5) Test deployment"
echo "6) Exit"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        deploy_vercel
        ;;
    2)
        deploy_netlify
        ;;
    3)
        build_production
        ;;
    4)
        setup_env
        ;;
    5)
        test_deployment
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!"
