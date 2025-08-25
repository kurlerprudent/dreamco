'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, Clock, Globe, Smartphone } from 'lucide-react'
import Link from 'next/link'

interface RealTimeStats {
  last24Hours: number
  hourlyBreakdown: Array<{ hour: number, count: number }>
  regionActivity: Record<string, number>
  deviceTypes: Record<string, number>
  averageResponsesPerHour: number
}

export default function AdminInsights() {
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRealTimeStats()
    // Refresh every 30 seconds
    const interval = setInterval(fetchRealTimeStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchRealTimeStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.success) {
        setRealTimeStats(data.realTimeStats)
      }
    } catch (error) {
      console.error('Failed to fetch real-time stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/admin">
            <Button className="bg-slate-700 hover:bg-slate-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">
              Real-time <span className="text-football-green">Insights</span>
            </h1>
            <p className="text-gray-400">Live analytics and trends</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-football-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : realTimeStats ? (
          <div className="space-y-8">
            {/* 24-hour Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="stat-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Last 24 Hours</p>
                      <p className="text-3xl font-bold text-white">{realTimeStats.last24Hours}</p>
                      <p className="text-football-green text-sm">responses</p>
                    </div>
                    <Clock className="w-8 h-8 text-football-green" />
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Average per Hour</p>
                      <p className="text-3xl font-bold text-white">
                        {realTimeStats.averageResponsesPerHour.toFixed(1)}
                      </p>
                      <p className="text-electric-blue text-sm">responses/hour</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-electric-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Peak Hour</p>
                      <p className="text-3xl font-bold text-white">
                        {realTimeStats.hourlyBreakdown.reduce((max, curr) => 
                          curr.count > max.count ? curr : max
                        ).hour}:00
                      </p>
                      <p className="text-neon-yellow text-sm">most active</p>
                    </div>
                    <Clock className="w-8 h-8 text-neon-yellow" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hourly Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="survey-card p-6">
                <CardHeader>
                  <CardTitle className="text-white">24-Hour Activity Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-12 gap-2 h-64">
                    {realTimeStats.hourlyBreakdown.map((hour, index) => {
                      const maxCount = Math.max(...realTimeStats.hourlyBreakdown.map(h => h.count))
                      const height = maxCount > 0 ? (hour.count / maxCount) * 100 : 0
                      
                      return (
                        <div key={index} className="flex flex-col items-center justify-end h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                            className="w-full bg-gradient-to-t from-football-green to-electric-blue rounded-t-md min-h-[4px] relative group"
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {hour.hour}:00 - {hour.count} responses
                            </div>
                          </motion.div>
                          <p className="text-xs text-gray-400 mt-2 transform rotate-45">
                            {hour.hour}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Device and Region Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Device Types */}
              <Card className="survey-card p-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-football-green" />
                    Device Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(realTimeStats.deviceTypes).map(([device, count]) => {
                      const total = Object.values(realTimeStats.deviceTypes).reduce((a, b) => a + b, 0)
                      const percentage = total > 0 ? (count / total) * 100 : 0
                      
                      return (
                        <div key={device} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{device}</span>
                            <span className="text-football-green font-bold">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-football-green to-electric-blue"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Region Activity */}
              <Card className="survey-card p-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-electric-blue" />
                    Network Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(realTimeStats.regionActivity).map(([region, count]) => {
                      const total = Object.values(realTimeStats.regionActivity).reduce((a, b) => a + b, 0)
                      const percentage = total > 0 ? (count / total) * 100 : 0
                      
                      return (
                        <div key={region} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{region}</span>
                            <span className="text-electric-blue font-bold">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-electric-blue to-neon-yellow"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="survey-card p-6">
                <CardHeader>
                  <CardTitle className="text-white">Activity Heatmap (Last 24 Hours)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
                    {realTimeStats.hourlyBreakdown.map((hour, index) => {
                      const maxCount = Math.max(...realTimeStats.hourlyBreakdown.map(h => h.count))
                      const intensity = maxCount > 0 ? hour.count / maxCount : 0
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                          className={`aspect-square rounded-sm relative group cursor-pointer ${
                            intensity > 0.7 ? 'bg-football-green' :
                            intensity > 0.4 ? 'bg-electric-blue' :
                            intensity > 0.2 ? 'bg-slate-600' :
                            'bg-slate-800'
                          }`}
                        >
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            {hour.hour}:00 - {hour.count} responses
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                    <span>24 hours ago</span>
                    <span>Now</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Failed to load real-time statistics.
          </div>
        )}
      </div>
    </div>
  )
}
