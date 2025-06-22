#!/bin/bash

# Netlify build script for Employee Management System
echo "🚀 Starting build process..."

# Navigate to frontend directory
cd ems

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in ems directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: npm install failed"
    exit 1
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

# Verify dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not created"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output available in ems/dist"
