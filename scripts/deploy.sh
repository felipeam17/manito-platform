#!/bin/bash

# MANITO Platform Deploy Script
echo "🚀 Deploying MANITO Platform to Vercel..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building project..."
pnpm build

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp env.example .env.local
    echo "📝 Please edit .env.local with your actual credentials before deploying"
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deploy complete!"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in Vercel dashboard"
echo "2. Set up Supabase project and configure database"
echo "3. Configure Stripe (optional for MVP)"
echo "4. Test your deployed application"
echo ""
echo "Happy coding! 🚀"
