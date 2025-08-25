'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Trophy, Users, Globe, Star } from 'lucide-react'

export default function MotiveSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    {
      icon: Users,
      percentage: "70%",
      description: "of players never get to showcase their talent beyond their local communities",
      delay: 0.2
    },
    {
      icon: Globe,
      percentage: "6%",
      description: "African players make up only 6% of Europe's top leagues",
      delay: 0.4
    },
    {
      icon: Star,
      percentage: "1%",
      description: "of aspiring footballers ever get properly scouted",
      delay: 0.6
    },
    {
      icon: Trophy,
      percentage: "∞",
      description: "Potential legends training on dusty pitches right now",
      delay: 0.8
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-slate-900 relative">
      {/* Section divider */}
      <div className="section-divider mb-16"></div>
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            The <span className="text-football-green">Reality</span> of African Football
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
            Every year, thousands of young footballers in Africa dream of going pro. 
            But less than 1% ever get scouted. Lack of exposure, networks, and 
            opportunities hold them back.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                variants={item}
                className="stat-card p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">
                  <IconComponent className="w-12 h-12 text-football-green group-hover:text-electric-blue transition-colors duration-300" />
                </div>
                <div className="text-4xl font-black text-white mb-2 group-hover:text-football-green transition-colors duration-300">
                  {stat.percentage}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Brighter Side Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Yet Africa produces some of the world's <br />
            <span className="text-football-green">greatest talents</span>
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-lg">
            {['Drogba', 'Essien', 'Mané', 'Salah', 'Koulibaly', 'Mahrez'].map((name, index) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="bg-gradient-to-r from-football-green to-electric-blue bg-clip-text text-transparent font-bold"
              >
                {name}
              </motion.span>
            ))}
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed bg-gradient-to-r from-football-green to-electric-blue bg-clip-text text-transparent font-semibold"
          >
            "We believe the next legend could be training right now on a dusty pitch. 
            Let's make sure the world sees them."
          </motion.p>
        </motion.div>
      </div>
      
      {/* Bottom section divider */}
      <div className="section-divider mt-16"></div>
    </section>
  )
}
