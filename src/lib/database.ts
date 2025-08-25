import { MongoClient, Db } from 'mongodb'

class DatabaseConnection {
  private static client: MongoClient | null = null
  private static db: Db | null = null

  private static getUri(): string {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable')
    }
    return uri
  }

  static async getClient(): Promise<MongoClient> {
    if (!this.client) {
      const uri = this.getUri()
      this.client = new MongoClient(uri)
      await this.client.connect()
    }
    return this.client
  }

  static async getDb(): Promise<Db> {
    if (!this.db) {
      const client = await this.getClient()
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
