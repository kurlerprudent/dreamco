const { MongoClient } = require('mongodb');

// Test the MongoDB connection
async function testConnection() {
  const uri = 'mongodb+srv://prudentkurler8:dExMJ8GI5pJ6Ow6D@cluster0.akbcll1.mongodb.net/hiddengems?retryWrites=true&w=majority&appName=Cluster0';
  
  console.log('Testing MongoDB connection...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000,
      retryWrites: true
    });
    
    console.log('Attempting to connect...');
    await client.connect();
    
    console.log('Connected successfully!');
    
    // Test a simple ping
    const db = client.db('hiddengems');
    await db.admin().ping();
    console.log('Database ping successful!');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('Connection closed.');
    
  } catch (error) {
    console.error('Connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Reason:', error.reason);
  }
}

testConnection();
