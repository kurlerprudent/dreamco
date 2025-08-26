import { NextRequest, NextResponse } from 'next/server'
import DatabaseConnection from '../../../../lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('Stats API called')
    const db = await DatabaseConnection.getDb()
    console.log('Database connected successfully for stats')
    const collection = db.collection('survey_responses')

    // Get responses from last 24 hours for real-time stats
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const recentResponses = await collection.find({
      timestamp: { $gte: twentyFourHoursAgo }
    }).toArray()

    // Hourly breakdown for the last 24 hours
    const hourlyBreakdown = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date()
      hour.setHours(hour.getHours() - i)
      const hourStart = new Date(hour)
      hourStart.setMinutes(0, 0, 0)
      const hourEnd = new Date(hourStart)
      hourEnd.setHours(hourEnd.getHours() + 1)

      const count = recentResponses.filter(r => {
        const responseTime = new Date(r.timestamp)
        return responseTime >= hourStart && responseTime < hourEnd
      }).length

      return {
        hour: hourStart.getHours(),
        count
      }
    }).reverse()

    // Most active regions (based on simplified IP analysis)
    const regionActivity = recentResponses.reduce((acc: Record<string, number>, response) => {
      // Simple IP-based region detection (in production, use proper geolocation)
      const region = response.ip?.startsWith('192.168') ? 'Local Network' : 
                    response.ip?.startsWith('10.') ? 'Private Network' : 
                    'External'
      acc[region] = (acc[region] || 0) + 1
      return acc
    }, {})

    // Top user agents/devices
    const deviceTypes = recentResponses.reduce((acc: Record<string, number>, response) => {
      const ua = response.userAgent?.toLowerCase() || ''
      const device = ua.includes('mobile') ? 'Mobile' :
                   ua.includes('tablet') ? 'Tablet' : 
                   'Desktop'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      realTimeStats: {
        last24Hours: recentResponses.length,
        hourlyBreakdown,
        regionActivity,
        deviceTypes,
        averageResponsesPerHour: recentResponses.length / 24
      }
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch real-time stats' },
      { status: 500 }
    )
  }
}
