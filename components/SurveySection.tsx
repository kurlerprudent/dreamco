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
import { Question, RoleQuestions } from '../types/survey'

interface SurveySectionProps {
  onSubmissionComplete: () => void
}

const roleQuestions: RoleQuestions[] = [
  {
    role: 'player',
    questions: [
      { id: 'age', question: 'What is your age?', type: 'number', required: true },
      { id: 'position', question: 'Which position do you play most?', type: 'select', options: ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Forward', 'Utility', 'Other'], required: true },
      { id: 'training_frequency', question: 'How often do you train each week?', type: 'select', options: ['1–2', '3–4', '5+', "I don't train regularly"], required: true },
      { id: 'current_team', question: 'Do you play for a team or club right now?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'scout_trial', question: 'Have you ever been invited to a trial by a scout or club?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'biggest_problem', question: 'What is the biggest problem stopping you from getting noticed? (choose up to 2)', type: 'multiselect', options: ['No exposure', 'Money for travel', 'No video footage', 'Poor facilities', 'Lack of coach support', 'Other'], required: true },
      { id: 'video_highlights', question: 'Do you have a short video of your play (highlights)?', type: 'select', options: ['Yes', 'No', 'I can record one if helped'], required: true },
      { id: 'pro_confidence', question: 'On a scale of 1–5, how confident are you about going pro?', type: 'rating', required: true },
      { id: 'travel_willingness', question: 'True or False: I would travel to a trial if travel costs were covered.', type: 'select', options: ['True', 'False'], required: true },
      { id: 'help_needed', question: 'In one short sentence, what help do you need most?', type: 'textarea', required: true }
    ]
  },
  {
    role: 'ex-player',
    questions: [
      { id: 'stop_age', question: 'At what age did you stop playing regularly?', type: 'select', options: ['Under 18', '18–23', '24–28', '29+'], required: true },
      { id: 'stop_reason', question: 'What was the main reason you stopped?', type: 'select', options: ['Injury', 'Money', 'No opportunities', 'Family', 'Lost interest', 'Other'], required: true },
      { id: 'follow_football', question: 'Do you still watch or follow local football regularly?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'mentoring_willing', question: 'Would you be willing to mentor or coach young players?', type: 'select', options: ['Yes', 'Maybe', 'No'], required: true },
      { id: 'support_impact', question: 'True or False: If I had more support, I would have continued playing.', type: 'select', options: ['True', 'False'], required: true },
      { id: 'biggest_barrier', question: 'What was the biggest barrier for you when you were playing?', type: 'select', options: ['No exposure', 'No funding', 'Poor coaching', 'Injuries', 'Other'], required: true },
      { id: 'talent_identification', question: 'How helpful would you be in identifying talent? (1 = not helpful, 5 = very helpful)', type: 'rating', required: true },
      { id: 'recommended_players', question: 'Have you recommended any young player to a coach or scout before?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'improvement_skill', question: 'What skill or quality should most young players improve?', type: 'select', options: ['Fitness', 'Technique', 'Tactics', 'Discipline', 'Mental strength', 'Other'], required: true },
      { id: 'change_needed', question: 'In one short sentence: what one change would have helped you most as a young player?', type: 'textarea', required: true }
    ]
  },
  {
    role: 'coach',
    questions: [
      { id: 'coaching_years', question: 'How many years have you been coaching?', type: 'select', options: ['Less than 2', '2–5', '6–10', '10+'], required: true },
      { id: 'age_groups', question: 'What age groups do you coach most?', type: 'select', options: ['U12', 'U13–U15', 'U16–U18', 'Adults'], required: true },
      { id: 'trial_frequency', question: 'How often do you hold trials or open sessions?', type: 'select', options: ['Weekly', 'Monthly', 'Rarely', 'Never'], required: true },
      { id: 'talent_visibility', question: 'True or False: Many talented players in my area are never seen by scouts.', type: 'select', options: ['True', 'False'], required: true },
      { id: 'biggest_challenge', question: 'What is your biggest challenge as a coach?', type: 'select', options: ['Funding', 'Facilities', 'Player commitment', 'Exposure', 'Injuries', 'Other'], required: true },
      { id: 'platform_usage', question: 'Would you use an easy platform to post trials and get verified applicants?', type: 'select', options: ['Yes', 'Maybe', 'No'], required: true },
      { id: 'video_importance', question: 'How important is player video footage when you recommend a player?', type: 'rating', required: true },
      { id: 'progress_records', question: 'Do you keep records of players\' progress (goals, minutes, awards)?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'profile_verification', question: 'Would you be willing to help verify a player\'s profile (watch a short clip and confirm)?', type: 'select', options: ['Yes', 'Maybe', 'No'], required: true },
      { id: 'youth_improvement', question: 'If you could improve one thing for youth development, what would it be?', type: 'textarea', required: true }
    ]
  },
  {
    role: 'scout',
    questions: [
      { id: 'active_scouting', question: 'Do you actively scout or recruit players now?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'scouting_methods', question: 'Which methods do you use to find players? (choose all that apply)', type: 'multiselect', options: ['Local matches', 'Video reels', 'Referrals', 'Trials', 'Social media', 'Other'], required: true },
      { id: 'talent_availability', question: 'How easy is it to find good talent locally?', type: 'select', options: ['Very easy', 'Somewhat easy', 'Hard', 'Very hard'], required: true },
      { id: 'common_weakness', question: 'What is the most common weakness you see in young players?', type: 'select', options: ['Fitness', 'Technique', 'Tactical sense', 'Attitude', 'Exposure'], required: true },
      { id: 'verified_profiles', question: 'True or False: Verified ID and match metadata would make me trust a profile more.', type: 'select', options: ['True', 'False'], required: true },
      { id: 'service_payment', question: 'Would you pay for a service that gives verified, searchable player profiles?', type: 'select', options: ['Yes', 'Maybe', 'No'], required: true },
      { id: 'monthly_shortlist', question: 'How many players do you shortlist on average per month?', type: 'select', options: ['0–5', '6–15', '16–30', '30+'], required: true },
      { id: 'highlight_value', question: 'Rate how valuable short highlight clips are to your decision (1–5).', type: 'rating', required: true },
      { id: 'scouting_tool', question: 'What tool or feature would make scouting faster for you?', type: 'select', options: ['Advanced filters', 'Coach endorsements', 'Trial scheduling', 'Video analysis', 'Other'], required: true },
      { id: 'signing_obstacle', question: 'In one short sentence, what stops you from signing more local talent?', type: 'textarea', required: true }
    ]
  },
  {
    role: 'investor',
    questions: [
      { id: 'investment_interest', question: 'Are you interested in investing in African football talent?', type: 'select', options: ['Very interested', 'Somewhat interested', 'Considering it', 'Not currently'], required: true },
      { id: 'investment_focus', question: 'What type of football investments interest you most?', type: 'select', options: ['Individual players', 'Youth academies', 'Facilities', 'Technology platforms', 'All of the above'], required: true },
      { id: 'success_metrics', question: 'How do you measure success in football investments?', type: 'multiselect', options: ['Player development', 'Financial returns', 'Social impact', 'Market expansion', 'Other'], required: true },
      { id: 'biggest_concern', question: 'What is your biggest concern about investing in African football?', type: 'textarea', required: true }
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

                        {question.type === 'rating' && (
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setValue(question.id, rating)}
                                className={`w-12 h-12 rounded-full border-2 border-slate-600 hover:border-football-green transition-colors
                                  ${watch(question.id) === rating ? 'bg-football-green text-black' : 'bg-slate-800 text-white'}`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        )}

                        {question.type === 'multiselect' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <label key={option} className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={option}
                                  onChange={(e) => {
                                    const currentValue = watch(question.id) || []
                                    const isArray = Array.isArray(currentValue)
                                    const values = isArray ? currentValue : []
                                    
                                    if (e.target.checked) {
                                      setValue(question.id, [...values, option])
                                    } else {
                                      setValue(question.id, values.filter((v: string) => v !== option))
                                    }
                                  }}
                                  className="w-4 h-4 text-football-green bg-slate-800 border-slate-600 rounded focus:ring-football-green"
                                />
                                <span className="text-white">{option}</span>
                              </label>
                            ))}
                          </div>
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
