import { MongoClient, Db } from 'mongodb'

class DatabaseConnection {
  private static client: MongoClient | null = null
  private static db: Db | null = null
  private static isConnecting = false

  private static getUri(): string {
    // Hardcoded MongoDB URI for production deployment
    const uri = 'mongodb+srv://prudentkurler8:dExMJ8GI5pJ6Ow6D@cluster0.akbcll1.mongodb.net/hiddengems?retryWrites=true&w=majority&appName=Cluster0'
    console.log('🔗 Using hardcoded MongoDB URI for reliable connection')
    return uri
  }

  static async getClient(): Promise<MongoClient> {
    // If we have a client, try to ping it to check if it's still connected
    if (this.client) {
      try {
        await this.client.db('hiddengems').admin().ping()
        return this.client
      } catch (error) {
        // Connection is bad, reset and reconnect
        this.client = null
        this.db = null
      }
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      if (this.client) {
        return this.client
      }
    }

    try {
      this.isConnecting = true
      
      const uri = this.getUri()
      this.client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 15000,  // Increased from 5000 to 15000
        socketTimeoutMS: 45000,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        connectTimeoutMS: 15000  // Added connection timeout
      })
      
      await this.client.connect()
      
      // Test the connection
      await this.client.db('hiddengems').admin().ping()
      
      this.db = null // Reset db so it gets recreated with new client
      this.isConnecting = false
      
      return this.client
    } catch (error) {
      this.isConnecting = false
      this.client = null
      this.db = null
      throw error
    }
  }

  static async getDb(): Promise<Db> {
    const client = await this.getClient()
    if (!this.db) {
      this.db = client.db('hiddengems')
    }
    return this.db
  }

  static async close(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}

export default DatabaseConnection
