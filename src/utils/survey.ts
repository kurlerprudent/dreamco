// Survey response validation utilities
export const validateSurveyResponse = (data: any) => {
  const errors: string[] = []
  
  if (!data.role) {
    errors.push('Role is required')
  }
  
  if (!data.responses || typeof data.responses !== 'object') {
    errors.push('Responses object is required')
  }
  
  const validRoles = ['player', 'ex-player', 'coach', 'scout', 'investor']
  if (data.role && !validRoles.includes(data.role)) {
    errors.push('Invalid role specified')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Data sanitization
export const sanitizeResponse = (data: any) => {
  return {
    role: String(data.role).toLowerCase().trim(),
    responses: Object.fromEntries(
      Object.entries(data.responses || {}).map(([key, value]) => [
        key,
        typeof value === 'string' ? String(value).trim() : value
      ])
    ),
    timestamp: new Date(),
    metadata: {
      userAgent: data.userAgent || 'unknown',
      ip: data.ip || 'unknown',
      submittedAt: new Date().toISOString()
    }
  }
}

// Response formatting for display
export const formatResponseForDisplay = (response: any) => {
  return {
    id: response._id?.toString() || '',
    role: response.role,
    responses: response.responses,
    timestamp: new Date(response.timestamp).toLocaleString(),
    metadata: response.metadata || {}
  }
}

// Statistics calculation utilities
export const calculateStats = (responses: any[]) => {
  const total = responses.length
  
  const roleBreakdown = responses.reduce((acc, response) => {
    acc[response.role] = (acc[response.role] || 0) + 1
    return acc
  }, {})
  
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const recentResponses = responses.filter(
    r => new Date(r.timestamp) > sevenDaysAgo
  ).length
  
  return {
    totalResponses: total,
    roleBreakdown,
    recentResponses,
    averagePerDay: total > 0 ? (total / Math.max(1, Math.floor((Date.now() - new Date(responses[responses.length - 1]?.timestamp || Date.now()).getTime()) / (24 * 60 * 60 * 1000)))) : 0
  }
}
