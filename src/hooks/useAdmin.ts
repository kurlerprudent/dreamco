import { useEffect, useState } from 'react'

// Hook for fetching dashboard data
export const useDashboardData = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      const result = await response.json()
      
      if (result.success) {
        setData(result)
        setError(null)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

// Hook for real-time stats
export const useRealTimeStats = (refreshInterval = 30000) => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const result = await response.json()
        
        if (result.success) {
          setStats(result.realTimeStats)
        }
      } catch (error) {
        console.error('Failed to fetch real-time stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, refreshInterval)
    
    return () => clearInterval(interval)
  }, [refreshInterval])

  return { stats, loading }
}

// Hook for authentication
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      // Simple authentication - in production use proper auth
      if (username === 'admin' && password === 'hiddengems2025') {
        setIsAuthenticated(true)
        localStorage.setItem('hiddengems_auth', 'true')
        return { success: true }
      } else {
        return { success: false, error: 'Invalid credentials' }
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('hiddengems_auth')
  }

  useEffect(() => {
    const saved = localStorage.getItem('hiddengems_auth')
    setIsAuthenticated(saved === 'true')
  }, [])

  return { isAuthenticated, loading, login, logout }
}
