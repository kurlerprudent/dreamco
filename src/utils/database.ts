// MongoDB connection utilities
export const connectToDatabase = async () => {
  try {
    const { MongoClient } = await import('mongodb')
    const uri = process.env.MONGODB_URI
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    
    const client = new MongoClient(uri)
    await client.connect()
    
    return {
      client,
      db: client.db('hiddengems')
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

// Database connection health check
export const testConnection = async (uri?: string) => {
  try {
    const { MongoClient } = await import('mongodb')
    const connectionString = uri || process.env.MONGODB_URI
    
    if (!connectionString) {
      throw new Error('No MongoDB URI provided')
    }
    
    const client = new MongoClient(connectionString)
    await client.connect()
    await client.db('hiddengems').admin().ping()
    await client.close()
    
    return { success: true, message: 'Connection successful' }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection failed' 
    }
  }
}

// Environment validation
export const validateEnvironment = () => {
  const requiredVars = ['MONGODB_URI']
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  return true
}
