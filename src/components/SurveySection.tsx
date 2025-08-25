'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, UserCheck, Users, Search, DollarSign, ChevronRight, Send } from 'lucide-react'
import { Question, RoleQuestions } from '@/types/survey'

interface SurveySectionProps {
  onSubmissionComplete: () => void
}

const roleQuestions: RoleQuestions[] = [
  {
    role: 'player',
    questions: [
      { id: 'age', question: 'What is your age?', type: 'number', required: true },
      { id: 'team_status', question: 'Current team status', type: 'select', options: ['Professional Team', 'Amateur Team', 'Unsigned/Free Agent', 'Youth Academy'], required: true },
      { id: 'training_frequency', question: 'How often do you train per week?', type: 'select', options: ['1-2 times', '3-4 times', '5-6 times', 'Daily'], required: true },
      { id: 'biggest_challenge', question: 'What is your biggest challenge in chasing your dream?', type: 'textarea', required: true }
    ]
  },
  {
    role: 'ex-player',
    questions: [
      { id: 'stop_age', question: 'At what age did you stop playing professionally?', type: 'number', required: true },
      { id: 'stop_reason', question: 'Why did you stop playing?', type: 'select', options: ['Injury', 'Lack of Support/Opportunities', 'Financial Reasons', 'Career Change', 'Other'], required: true },
      { id: 'mentoring_interest', question: 'Would you mentor young players if given the chance?', type: 'select', options: ['Definitely Yes', 'Probably Yes', 'Maybe', 'Probably No', 'Definitely No'], required: true },
      { id: 'advice', question: 'What advice would you give to current players?', type: 'textarea', required: false }
    ]
  },
  {
    role: 'coach',
    questions: [
      { id: 'players_count', question: 'How many players are currently under your training?', type: 'select', options: ['1-10', '11-25', '26-50', '51-100', '100+'], required: true },
      { id: 'coaching_challenge', question: 'What is your biggest challenge in coaching in Africa?', type: 'textarea', required: true },
      { id: 'experience_years', question: 'How many years of coaching experience do you have?', type: 'select', options: ['Less than 1 year', '1-3 years', '4-7 years', '8-15 years', '15+ years'], required: true },
      { id: 'success_stories', question: 'Have any of your players gone professional?', type: 'select', options: ['Yes, multiple players', 'Yes, one player', 'Not yet, but close', 'No, but hopeful'], required: false }
    ]
  },
  {
    role: 'scout',
    questions: [
      { id: 'scouted_count', question: 'How many players have you scouted from Africa?', type: 'select', options: ['None yet', '1-5', '6-15', '16-30', '30+'], required: true },
      { id: 'scouting_challenges', question: 'What are the biggest challenges in discovering talent in Africa?', type: 'textarea', required: true },
      { id: 'organization_type', question: 'What type of organization do you work with?', type: 'select', options: ['Professional Club', 'Talent Agency', 'Independent Scout', 'Academy', 'Other'], required: true },
      { id: 'success_rate', question: 'What percentage of scouted players actually get opportunities?', type: 'select', options: ['Less than 5%', '5-15%', '16-30%', '31-50%', 'More than 50%'], required: false }
    ]
  },
  {
    role: 'investor',
    questions: [
      { id: 'previous_investment', question: 'Have you invested in football before?', type: 'select', options: ['Yes, extensively', 'Yes, a few times', 'Once', 'No, but interested', 'No, first time considering'], required: true },
      { id: 'investment_encouragement', question: 'What would encourage you to invest more in African football?', type: 'textarea', required: true },
      { id: 'investment_type', question: 'What type of football investment interests you most?', type: 'select', options: ['Player Development', 'Academy Infrastructure', 'Technology/Platforms', 'Grassroots Programs', 'Professional Teams'], required: true },
      { id: 'budget_range', question: 'What is your typical investment range?', type: 'select', options: ['Under $10K', '$10K - $50K', '$50K - $200K', '$200K - $1M', 'Over $1M'], required: false }
    ]
  }
]

export default function SurveySection({ onSubmissionComplete }: SurveySectionProps) {
  const [currentStep, setCurrentStep] = useState<'role' | 'questions' | 'submitting'>('role')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm()

  const roles = [
    { id: 'player', name: 'Football Player', icon: User, description: 'Current or aspiring professional player' },
    { id: 'ex-player', name: 'Ex-Player', icon: UserCheck, description: 'Former professional or semi-professional player' },
    { id: 'coach', name: 'Coach', icon: Users, description: 'Football coach or trainer' },
    { id: 'scout', name: 'Scout/Agent', icon: Search, description: 'Talent scout or player agent' },
    { id: 'investor', name: 'Investor/Sponsor', icon: DollarSign, description: 'Investor or sponsor interested in football' }
  ]

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role)
    setCurrentStep('questions')
  }

  const getCurrentQuestions = (): Question[] => {
    const roleData = roleQuestions.find(r => r.role === selectedRole)
    return roleData ? roleData.questions : []
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole,
          responses: data
        }),
      })

      if (response.ok) {
        onSubmissionComplete()
      } else {
        throw new Error('Failed to submit survey')
      }
    } catch (error) {
      console.error('Survey submission error:', error)
      alert('Failed to submit survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="survey" className="py-20 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Join the <span className="text-football-green">Movement</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Share your voice and help us understand the football ecosystem in Africa. 
            Your anonymous input will shape the future of talent discovery.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 'role' && (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
                  Who are you in the football world?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roles.map((role, index) => {
                    const IconComponent = role.icon
                    return (
                      <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card 
                          className="survey-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 group"
                          onClick={() => handleRoleSelection(role.id)}
                        >
                          <div className="text-center">
                            <IconComponent className="w-12 h-12 text-football-green mx-auto mb-4 group-hover:text-electric-blue transition-colors duration-300" />
                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-football-green transition-colors duration-300">
                              {role.name}
                            </h4>
                            <p className="text-gray-400 text-sm mb-4">
                              {role.description}
                            </p>
                            <ChevronRight className="w-6 h-6 text-football-green mx-auto group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="survey-card p-8">
                  <div className="mb-8">
                    <button
                      onClick={() => setCurrentStep('role')}
                      className="text-football-green hover:text-electric-blue transition-colors duration-300 mb-4"
                    >
                      ← Back to role selection
                    </button>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Tell us about your experience as a{' '}
                      <span className="text-football-green">
                        {roles.find(r => r.id === selectedRole)?.name}
                      </span>
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {getCurrentQuestions().map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <Label className="text-white font-semibold text-lg">
                          {question.question}
                          {question.required && <span className="text-red-400 ml-1">*</span>}
                        </Label>
                        
                        {question.type === 'text' && (
                          <Input
                            {...register(question.id, { required: question.required })}
                            className="bg-slate-800 border-slate-600 text-white focus:border-football-green"
                            placeholder="Your answer..."
                          />
                        )}
                        
                        {question.type === 'number' && (
                          <Input
                            type="number"
                            {...register(question.id, { required: question.required })}
                            className="bg-slate-800 border-slate-600 text-white focus:border-football-green"
                            placeholder="Enter number..."
                          />
                        )}
                        
                        {question.type === 'textarea' && (
                          <Textarea
                            {...register(question.id, { required: question.required })}
                            className="bg-slate-800 border-slate-600 text-white focus:border-football-green min-h-[100px]"
                            placeholder="Share your thoughts..."
                          />
                        )}
                        
                        {question.type === 'select' && question.options && (
                          <Select onValueChange={(value) => setValue(question.id, value)}>
                            <SelectTrigger className="bg-slate-800 border-slate-600 text-white focus:border-football-green">
                              <SelectValue placeholder="Select an option..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              {question.options.map((option) => (
                                <SelectItem key={option} value={option} className="text-white focus:bg-slate-700">
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        {errors[question.id] && (
                          <p className="text-red-400 text-sm">This field is required</p>
                        )}
                      </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="pt-6"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="glow-button text-black font-bold text-lg px-8 py-4 rounded-full w-full md:w-auto hover:scale-105 transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Survey
                            <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
