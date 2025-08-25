import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const client = new MongoClient(uri)

export async function GET(request: NextRequest) {
  try {
    await client.connect()
    const db = client.db('hiddengems')
    const collection = db.collection('survey_responses')

    // Get all responses
    const responses = await collection.find({}).sort({ timestamp: -1 }).toArray()
    
    // Calculate stats
    const totalResponses = responses.length
    
    // Role breakdown
    const roleBreakdown = responses.reduce((acc: Record<string, number>, response) => {
      acc[response.role] = (acc[response.role] || 0) + 1
      return acc
    }, {})

    // Recent responses (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentResponses = responses.filter(r => new Date(r.timestamp) > sevenDaysAgo).length

    // Extract common challenges from text responses
    const challenges: string[] = []
    responses.forEach(response => {
      Object.entries(response.responses).forEach(([key, value]) => {
        if (key.includes('challenge') && typeof value === 'string' && value.length > 10) {
          // Simple keyword extraction - in production, use NLP
          const words = value.toLowerCase().split(/\W+/).filter(word => word.length > 3)
          challenges.push(...words)
        }
      })
    })
    
    // Get top challenges by frequency
    const challengeFreq = challenges.reduce((acc: Record<string, number>, challenge) => {
      acc[challenge] = (acc[challenge] || 0) + 1
      return acc
    }, {})
    
    const topChallenges = Object.entries(challengeFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([challenge]) => challenge)

    const stats = {
      totalResponses,
      roleBreakdown,
      recentResponses,
      topChallenges
    }

    return NextResponse.json({
      success: true,
      responses: responses.map(r => ({
        ...r,
        _id: r._id.toString()
      })),
      stats
    })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
