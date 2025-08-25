'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Heart, Star, Trophy, ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

interface ThankYouSectionProps {
  onBack?: () => void
}

export default function ThankYouSection({ onBack }: ThankYouSectionProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-football-green rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-electric-blue rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-yellow rounded-full filter blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <CheckCircle className="w-24 h-24 text-football-green mx-auto animate-glow" />
          </motion.div>

          {/* Thank You Title */}
          <motion.h1 
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-football-green via-electric-blue to-neon-yellow bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Thank You!
          </motion.h1>
          
          {/* Main Message */}
          <motion.p 
            className="text-2xl md:text-3xl text-white mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Your voice matters. Together, we're building a{' '}
            <span className="text-football-green font-bold">brighter future</span>{' '}
            for football talent.
          </motion.p>
          
          {/* Inspirational Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-football-green/20"
          >
            <Trophy className="w-12 h-12 text-football-green mx-auto mb-4" />
            <blockquote className="text-xl md:text-2xl text-gray-200 italic font-light leading-relaxed">
              "The future of football is waiting to be discovered. 
              Every legend started as a hidden gem, and today, 
              you've helped us shine a light on the next generation."
            </blockquote>
          </motion.div>

          {/* Stats Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: Heart, label: 'Responses Collected', value: '∞' },
              { icon: Star, label: 'Dreams Supported', value: '∞' },
              { icon: Trophy, label: 'Future Legends', value: '∞' }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 + index * 0.2 }}
                  className="stat-card p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300"
                >
                  <IconComponent className="w-10 h-10 text-football-green mx-auto mb-3 group-hover:text-electric-blue transition-colors duration-300" />
                  <div className="text-3xl font-bold text-white mb-2 group-hover:text-football-green transition-colors duration-300">
                    {stat.value}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Final Message */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="text-lg text-gray-300 mb-8"
          >
            Your anonymous contribution helps us understand the football ecosystem better. 
            Watch this space for updates on how we're transforming African football!
          </motion.p>

          {/* Back Button */}
          {onBack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="mb-8"
            >
              <Button
                onClick={onBack}
                variant="outline"
                className="border-football-green text-football-green hover:bg-football-green hover:text-slate-900 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-full"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Take Another Survey
              </Button>
            </motion.div>
          )}

          {/* Footer tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="pt-8 border-t border-football-green/30"
          >
            <p className="text-football-green font-bold text-xl">
              HiddenGems — Talent Beyond the Spotlight
            </p>
          </motion.div>
        </motion.div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-football-green rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
