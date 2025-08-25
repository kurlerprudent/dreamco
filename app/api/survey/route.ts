import { NextRequest, NextResponse } from 'next/server'
import DatabaseConnection from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.role || !body.responses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await DatabaseConnection.getDb()
    const collection = db.collection('survey_responses')

    const surveyResponse = {
      role: body.role,
      responses: body.responses,
      timestamp: new Date(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    const result = await collection.insertOne(surveyResponse)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Survey response saved successfully'
    })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to save survey response' },
      { status: 500 }
    )
  }
}
