import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mongoUri } = body

    if (!mongoUri) {
      return NextResponse.json(
        { success: false, error: 'MongoDB URI is required' },
        { status: 400 }
      )
    }

    // Test the connection
    const client = new MongoClient(mongoUri)
    
    try {
      await client.connect()
      
      // Test basic operations
      const db = client.db('hiddengems')
      await db.admin().ping()
      
      // Check if collections exist or create them
      const collections = await db.listCollections().toArray()
      const hasResponsesCollection = collections.some(col => col.name === 'survey_responses')
      
      if (!hasResponsesCollection) {
        await db.createCollection('survey_responses')
      }

      await client.close()

      return NextResponse.json({
        success: true,
        message: 'Connection successful! Database and collections are ready.',
        details: {
          connected: true,
          databaseName: 'hiddengems',
          collectionsReady: true
        }
      })

    } catch (dbError) {
      await client.close()
      throw dbError
    }

  } catch (error) {
    console.error('Connection test failed:', error)
    
    let errorMessage = 'Connection failed'
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        errorMessage = 'Authentication failed - check username/password'
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Connection timeout - check network access or IP whitelist'
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Invalid hostname - check your connection string'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage
    })
  }
}
