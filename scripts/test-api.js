// Test script for MongoDB connection and survey API
// Run with: node scripts/test-api.js

const { MongoClient } = require('mongodb')

async function testMongoDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
  const client = new MongoClient(uri)

  try {
    console.log('🔗 Connecting to MongoDB...')
    await client.connect()
    
    const db = client.db('play2pro')
    const collection = db.collection('survey_responses')
    
    // Test insert
    const testResponse = {
      role: 'player',
      responses: {
        age: 22,
        team_status: 'Amateur Team',
        training_frequency: '5-6 times',
        biggest_challenge: 'Lack of exposure and scouting opportunities'
      },
      timestamp: new Date(),
      ip: 'test',
      userAgent: 'test-script'
    }
    
    const result = await collection.insertOne(testResponse)
    console.log('✅ Test document inserted:', result.insertedId)
    
    // Test query
    const count = await collection.countDocuments()
    console.log('📊 Total survey responses:', count)
    
    // Clean up test data
    await collection.deleteOne({ _id: result.insertedId })
    console.log('🧹 Test data cleaned up')
    
    console.log('🎉 MongoDB connection test successful!')
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message)
    console.log('💡 Make sure MongoDB is running or check your connection string')
  } finally {
    await client.close()
  }
}

async function testSurveyAPI() {
  try {
    console.log('🧪 Testing Survey API...')
    
    const response = await fetch('http://localhost:3000/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'coach',
        responses: {
          players_count: '11-25',
          coaching_challenge: 'Limited resources and infrastructure',
          experience_years: '4-7 years'
        }
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API test successful:', data)
    } else {
      console.error('❌ API test failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ API test error:', error.message)
    console.log('💡 Make sure the Next.js server is running on localhost:3000')
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Play2Pro API Tests Starting...\n')
  
  await testMongoDB()
  console.log('\n' + '='.repeat(50) + '\n')
  await testSurveyAPI()
  
  console.log('\n🎯 All tests completed!')
}

runTests().catch(console.error)
