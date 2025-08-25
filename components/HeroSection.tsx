'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'

export default function HeroSection() {
  const scrollToSurvey = () => {
    const surveySection = document.getElementById('survey')
    surveySection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen hero-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-football-green rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-electric-blue rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
                    <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-football-green to-slate-200 bg-clip-text text-transparent"
          >
            HiddenGems
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            From the Streets to the Stadiums:<br />
            <span className="text-football-green">Giving Every Footballer a Chance</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Football in Africa is full of talent, but opportunities are rare. 
            We're building a bridge between local passion and global recognition.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <Button 
              onClick={scrollToSurvey}
              className="glow-button text-black font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-300"
            >
              Take the Survey
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Floating animation elements */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-football-green rounded-full flex justify-center">
            <div className="w-1 h-3 bg-football-green rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
