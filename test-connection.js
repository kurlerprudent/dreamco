const { MongoClient } = require('mongodb')

async function testConnection() {
  const uri = 'mongodb+srv://prudentkurler8:dExMJ8GI5pJ6Ow6D@cluster0.akbcll1.mongodb.net/hiddengems?retryWrites=true&w=majority&appName=Cluster0'
  
  console.log('Testing connection to MongoDB Atlas...')
  console.log('URI:', uri)
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000, // 10 second timeout
    connectTimeoutMS: 10000,
  })

  try {
    console.log('Attempting to connect...')
    await client.connect()
    console.log('✅ Connected successfully!')
    
    const db = client.db('hiddengems')
    console.log('✅ Database selected successfully!')
    
    // Test ping
    await db.admin().ping()
    console.log('✅ Ping successful!')
    
    // Test collection access
    const collection = db.collection('survey_responses')
    const count = await collection.countDocuments()
    console.log('✅ Collection access successful! Document count:', count)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Error details:', error)
  } finally {
    await client.close()
    console.log('Connection closed.')
  }
}

testConnection()
