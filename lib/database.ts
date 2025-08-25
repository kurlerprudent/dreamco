import { MongoClient, Db } from 'mongodb'

class DatabaseConnection {
  private static client: MongoClient | null = null
  private static db: Db | null = null
  private static isConnecting = false

  private static getUri(): string {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable')
    }
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
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxIdleTimeMS: 30000,
        retryWrites: true
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
