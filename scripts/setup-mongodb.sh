#!/bin/bash

# MongoDB Setup Script for Play2Pro

echo "🚀 Setting up MongoDB for Play2Pro..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first:"
    echo "   Ubuntu/Debian: sudo apt-get install mongodb"
    echo "   macOS: brew install mongodb-community"
    echo "   Or use MongoDB Atlas: https://www.mongodb.com/atlas"
    exit 1
fi

# Create database and collection
echo "📊 Creating database and collection..."

mongosh --eval "
use play2pro;
db.createCollection('survey_responses');
db.survey_responses.createIndex({ 'timestamp': 1 });
db.survey_responses.createIndex({ 'role': 1 });
print('✅ Database and collection created successfully!');
"

echo "🎯 MongoDB setup complete!"
echo "🌐 Start your Next.js app: npm run dev"
echo "📝 Collection: play2pro.survey_responses"
