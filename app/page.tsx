'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import MotiveSection from '@/components/MotiveSection'
import SurveySection from '@/components/SurveySection'
import ThankYouSection from '@/components/ThankYouSection'

export default function Home() {
  const [surveySubmitted, setSurveySubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
              <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-football-green mx-auto mb-4"></div>
            <p className="text-football-green font-bold text-xl">Loading HiddenGems...</p>
          </div>
        </div>
    )
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {!surveySubmitted ? (
        <>
          <HeroSection />
          <MotiveSection />
          <SurveySection onSubmissionComplete={() => setSurveySubmitted(true)} />
        </>
      ) : (
        <ThankYouSection />
      )}
    </main>
  )
}
