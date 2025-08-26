export interface SurveyResponse {
  role: 'player' | 'ex-player' | 'coach' | 'scout' | 'investor'
  responses: Record<string, string | number | boolean | string[]>
  timestamp?: Date
}

export interface Question {
  id: string
  question: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'rating' | 'multiselect' | 'boolean' | 'checkbox'
  options?: string[]
  required?: boolean
}

export interface RoleQuestions {
  role: string
  questions: Question[]
}
