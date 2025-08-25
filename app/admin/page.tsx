'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  Users, 
  BarChart3, 
  Eye, 
  Calendar, 
  TrendingUp, 
  Download,
  RefreshCw,
  Lock,
  Shield,
  Activity,
  BarChart,
  Settings
} from 'lucide-react'

interface SurveyResponse {
  _id: string
  role: string
  responses: Record<string, any>
  timestamp: string
  ip: string
  userAgent: string
}

interface DashboardStats {
  totalResponses: number
  roleBreakdown: Record<string, number>
  recentResponses: number
  topChallenges: string[]
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  const authenticate = () => {
    // Simple authentication - in production use proper auth
    if (username === 'admin' && password === 'hiddengems2025') {
      setIsAuthenticated(true)
      fetchData()
    } else {
      alert('Invalid credentials')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      
      if (data.success) {
        setResponses(data.responses)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch('/api/admin/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hiddengems-responses-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const filteredResponses = responses.filter(response => {
    if (selectedRole !== 'all' && response.role !== selectedRole) return false
    
    if (dateFilter !== 'all') {
      const responseDate = new Date(response.timestamp)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - responseDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dateFilter === '7d' && daysDiff > 7) return false
      if (dateFilter === '30d' && daysDiff > 30) return false
    }
    
    return true
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="survey-card p-8">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-football-green mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-white">
                HiddenGems Admin
              </CardTitle>
              <p className="text-gray-400">Secure access to survey analytics</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label className="text-white">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Enter password"
                  onKeyPress={(e) => e.key === 'Enter' && authenticate()}
                />
              </div>
              <Button 
                onClick={authenticate}
                className="glow-button w-full text-black font-bold"
              >
                <Lock className="w-4 h-4 mr-2" />
                Access Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              HiddenGems <span className="text-football-green">Analytics</span>
            </h1>
            <p className="text-gray-400">Survey feedback and insights dashboard</p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/admin/config">
              <Button className="bg-slate-700 hover:bg-slate-600 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Config
              </Button>
            </Link>
            <Link href="/admin/insights">
              <Button className="bg-slate-700 hover:bg-slate-600 text-white">
                <BarChart className="w-4 h-4 mr-2" />
                Insights
              </Button>
            </Link>
            <Button
              onClick={fetchData}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={exportData}
              className="glow-button text-black font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Responses</p>
                    <p className="text-3xl font-bold text-white">{stats.totalResponses}</p>
                  </div>
                  <Users className="w-8 h-8 text-football-green" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Most Active Role</p>
                    <p className="text-xl font-bold text-white capitalize">
                      {Object.entries(stats.roleBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-electric-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Recent (7 days)</p>
                    <p className="text-3xl font-bold text-white">{stats.recentResponses}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-neon-yellow" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Now</p>
                    <p className="text-3xl font-bold text-white">
                      <Activity className="w-6 h-6 inline text-football-green animate-pulse" />
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-football-green" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="survey-card p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-white mb-2 block">Filter by Role</Label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-800 border-slate-600 text-white rounded-md p-2 focus:border-football-green"
                >
                  <option value="all">All Roles</option>
                  <option value="player">Players</option>
                  <option value="ex-player">Ex-Players</option>
                  <option value="coach">Coaches</option>
                  <option value="scout">Scouts/Agents</option>
                  <option value="investor">Investors</option>
                </select>
              </div>
              
              <div className="flex-1">
                <Label className="text-white mb-2 block">Filter by Date</Label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full bg-slate-800 border-slate-600 text-white rounded-md p-2 focus:border-football-green"
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Role Breakdown Chart */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="survey-card p-6">
              <CardHeader>
                <CardTitle className="text-white">Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(stats.roleBreakdown).map(([role, count]) => (
                    <div key={role} className="text-center">
                      <div className="mb-2">
                        <div 
                          className="w-full bg-slate-700 rounded-full h-4 overflow-hidden"
                        >
                          <div 
                            className="h-full bg-gradient-to-r from-football-green to-electric-blue transition-all duration-1000"
                            style={{ 
                              width: `${stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-white font-bold capitalize">{role}</p>
                      <p className="text-football-green text-2xl font-bold">{count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Responses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="survey-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Survey Responses ({filteredResponses.length})
                <span className="text-sm text-gray-400 font-normal">
                  Showing {selectedRole === 'all' ? 'all roles' : selectedRole} • {dateFilter === 'all' ? 'all time' : dateFilter}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-football-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading responses...</p>
                    </div>
                  ) : filteredResponses.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No responses found for the selected filters.
                    </div>
                  ) : (
                    filteredResponses.map((response, index) => (
                      <motion.div
                        key={response._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-football-green/30 transition-colors duration-300"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              response.role === 'player' ? 'bg-football-green/20 text-football-green' :
                              response.role === 'ex-player' ? 'bg-electric-blue/20 text-electric-blue' :
                              response.role === 'coach' ? 'bg-yellow-500/20 text-yellow-500' :
                              response.role === 'scout' ? 'bg-purple-500/20 text-purple-500' :
                              'bg-pink-500/20 text-pink-500'
                            }`}>
                              {response.role.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {new Date(response.timestamp).toLocaleDateString()} {new Date(response.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(response.responses).map(([key, value]) => (
                            <div key={key} className="bg-slate-800/30 rounded p-3">
                              <p className="text-football-green text-xs font-semibold mb-1 capitalize">
                                {key.replace('_', ' ')}
                              </p>
                              <p className="text-white text-sm">
                                {typeof value === 'string' && value.length > 100 
                                  ? `${value.substring(0, 100)}...` 
                                  : String(value)
                                }
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights Section */}
        {stats && stats.topChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="survey-card p-6">
              <CardHeader>
                <CardTitle className="text-white">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-football-green font-semibold mb-2">Most Common Challenges:</h4>
                    <div className="flex flex-wrap gap-2">
                      {stats.topChallenges.slice(0, 10).map((challenge, index) => (
                        <span
                          key={index}
                          className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {challenge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
