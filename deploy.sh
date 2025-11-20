#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting Zodiac TaskFlow deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start containers
echo "📦 Building Docker images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🗄️  Running database migrations..."
docker-compose exec backend bunx prisma migrate deploy

echo "✅ Deployment complete!"
echo ""
echo "📍 Services are running at:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:3000"
echo "   Database: localhost:5432"
echo ""
echo "📊 View logs with: docker-compose logs -f"
echo "🛑 Stop services with: docker-compose down"
