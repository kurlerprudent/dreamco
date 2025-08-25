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
    
    // Convert to CSV format
    if (responses.length === 0) {
      return new NextResponse('No data available', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="hiddengems-responses.csv"'
        }
      })
    }

    // Get all unique response keys across all responses
    const allKeys = new Set<string>()
    responses.forEach(response => {
      Object.keys(response.responses).forEach(key => allKeys.add(key))
    })

    // Create CSV headers
    const headers = ['timestamp', 'role', 'ip', 'userAgent', ...Array.from(allKeys)]
    
    // Create CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...responses.map(response => {
        const row = [
          `"${response.timestamp}"`,
          `"${response.role}"`,
          `"${response.ip || 'unknown'}"`,
          `"${(response.userAgent || 'unknown').replace(/"/g, '""')}"`,
          ...Array.from(allKeys).map(key => {
            const value = response.responses[key] || ''
            // Escape quotes and wrap in quotes
            return `"${String(value).replace(/"/g, '""')}"`
          })
        ]
        return row.join(',')
      })
    ]

    const csvContent = csvRows.join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="hiddengems-responses-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
