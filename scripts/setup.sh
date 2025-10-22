#!/bin/bash

# MANITO Platform Setup Script
echo "🚀 Setting up MANITO Platform..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Node.js version is 18+
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy environment file
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your actual credentials"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
pnpm db:generate

# Setup database (if DATABASE_URL is configured)
if grep -q "DATABASE_URL=your_database_url" .env.local; then
    echo "⚠️  Please configure DATABASE_URL in .env.local before running database setup"
else
    echo "🗄️  Setting up database..."
    pnpm db:push
    
    echo "🌱 Seeding database..."
    pnpm db:seed
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your actual credentials"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀"
