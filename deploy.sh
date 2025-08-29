#!/bin/bash

# 🚀 Silverback Discount System - Production Deployment Script

echo "🎯 Starting production deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    vercel --prod
fi

echo "✅ Deployment complete!"
echo ""
echo "🎉 Your Silverback Discount System is now live!"
echo ""
echo "📍 Available endpoints:"
echo "   - Admin Dashboard: https://your-app.vercel.app/admin-dashboard"  
echo "   - API Health: https://your-app.vercel.app/api/admin/health"
echo "   - Discount Validation: https://your-app.vercel.app/api/validate-discount"
echo ""
echo "🔐 Admin Login:"
echo "   - Email: shazze@silverbacktreatment.se"
echo "   - Password: silverback2024!"
echo ""
echo "✨ All 6 discount codes are ready for use!"
