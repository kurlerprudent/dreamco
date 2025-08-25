'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Database, Save, TestTube, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminConfig() {
  const [mongoUri, setMongoUri] = useState('')
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)

  const testConnection = async () => {
    if (!mongoUri.trim()) {
      alert('Please enter a MongoDB URI')
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoUri })
      })

      const data = await response.json()
      setTestResult(data.success ? 'success' : 'error')
    } catch (error) {
      setTestResult('error')
    } finally {
      setTesting(false)
    }
  }

  const saveConfiguration = async () => {
    if (!mongoUri.trim()) {
      alert('Please enter a MongoDB URI')
      return
    }

    setSaving(true)
    try {
      // In a real app, you'd save this to a secure config store
      localStorage.setItem('hiddengems_mongo_uri', mongoUri)
      alert('Configuration saved! Restart the application to apply changes.')
    } catch (error) {
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="container mx-auto max-w-4xl">
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
              Database <span className="text-football-green">Configuration</span>
            </h1>
            <p className="text-gray-400">Configure your MongoDB connection</p>
          </div>
        </motion.div>

        {/* Configuration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="survey-card p-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-6 h-6 mr-3 text-football-green" />
                MongoDB Connection String
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white text-lg mb-3 block">
                  Enter your MongoDB Atlas connection string:
                </Label>
                <Textarea
                  value={mongoUri}
                  onChange={(e) => setMongoUri(e.target.value)}
                  placeholder="mongodb+srv://username:password@cluster.mongodb.net/hiddengems"
                  className="bg-slate-800 border-slate-600 text-white min-h-[100px] font-mono"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Example: mongodb+srv://username:password@cluster.mongodb.net/play2pro
                </p>
              </div>

              {/* Connection Test Result */}
              {testResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg border ${
                    testResult === 'success' 
                      ? 'bg-green-900/30 border-green-500/50 text-green-400'
                      : 'bg-red-900/30 border-red-500/50 text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">
                      {testResult === 'success' 
                        ? 'Connection successful!' 
                        : 'Connection failed. Please check your URI.'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={testConnection}
                  disabled={testing || !mongoUri.trim()}
                  className="bg-electric-blue hover:bg-electric-blue/80 text-black font-bold"
                >
                  {testing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>

                <Button
                  onClick={saveConfiguration}
                  disabled={saving || !mongoUri.trim() || testResult !== 'success'}
                  className="glow-button text-black font-bold"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="survey-card p-6">
            <CardHeader>
              <CardTitle className="text-white">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div>
                <h4 className="text-football-green font-semibold mb-2">1. MongoDB Atlas Setup:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Create a free account at <a href="https://mongodb.com/atlas" target="_blank" className="text-electric-blue hover:underline">MongoDB Atlas</a></li>
                  <li>Create a new cluster</li>
                  <li>Create a database user with read/write permissions</li>
                  <li>Whitelist your IP address (or use 0.0.0.0/0 for development)</li>
                  <li>Get your connection string from the "Connect" button</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-football-green font-semibold mb-2">2. Environment Configuration:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Add your connection string to <code className="bg-slate-700 px-2 py-1 rounded">.env.local</code></li>
                  <li>Replace <code className="bg-slate-700 px-2 py-1 rounded">username</code> and <code className="bg-slate-700 px-2 py-1 rounded">password</code> with your credentials</li>
                  <li>Ensure the database name is <code className="bg-slate-700 px-2 py-1 rounded">play2pro</code></li>
                  <li>Restart your Next.js development server</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h5 className="text-neon-yellow font-semibold mb-2">Example Connection String:</h5>
                <code className="text-xs text-gray-300 break-all">
                  mongodb+srv://play2pro_user:your_password@cluster0.abcdef.mongodb.net/play2pro?retryWrites=true&w=majority
                </code>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
