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
      // Basic Demographics
      { id: 'age', question: 'What is your age?', type: 'number', required: true },
      { id: 'location', question: 'Which country/region are you based in?', type: 'text', required: true },
      { id: 'position', question: 'What is your primary playing position?', type: 'select', options: ['Goalkeeper', 'Centre-Back', 'Full-Back', 'Wing-Back', 'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder', 'Winger', 'Striker', 'False 9', 'Utility Player'], required: true },
      
      // Current Status & Experience
      { id: 'team_status', question: 'Current team status', type: 'select', options: ['Professional Team', 'Semi-Professional Team', 'Amateur Team', 'Youth Academy', 'University Team', 'Unsigned/Free Agent', 'Recreational Only'], required: true },
      { id: 'playing_level', question: 'What is the highest level you have played at?', type: 'select', options: ['International Level', 'Professional League', 'Semi-Professional', 'Regional/State Level', 'Local/Community Level', 'School/University', 'Never played organized football'], required: true },
      { id: 'years_playing', question: 'How many years have you been playing organized football?', type: 'select', options: ['Less than 2 years', '2-5 years', '6-10 years', '11-15 years', 'More than 15 years'], required: true },
      
      // Training & Development
      { id: 'training_frequency', question: 'How often do you train per week?', type: 'select', options: ['Less than once', '1-2 times', '3-4 times', '5-6 times', 'Daily', 'Multiple sessions daily'], required: true },
      { id: 'training_type', question: 'What type of training do you focus on most?', type: 'select', options: ['Team training only', 'Individual skills', 'Fitness/conditioning', 'Tactical awareness', 'Mental/psychological', 'Balanced approach'], required: true },
      { id: 'coaching_quality', question: 'How would you rate the quality of coaching available to you?', type: 'select', options: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor', 'No proper coaching'], required: true },
      
      // Opportunities & Exposure
      { id: 'trial_invitations', question: 'How many professional trials have you been invited to?', type: 'select', options: ['None', '1-2', '3-5', '6-10', 'More than 10'], required: true },
      { id: 'scout_contact', question: 'Have scouts or agents ever contacted you?', type: 'boolean', required: true },
      { id: 'video_portfolio', question: 'Do you have professional highlight videos?', type: 'boolean', required: true },
      
      // Challenges & Barriers (Multiple Choice)
      { id: 'biggest_challenges', question: 'What are your biggest challenges? (Select all that apply)', type: 'checkbox', options: ['Lack of exposure/visibility', 'Financial constraints', 'Poor facilities/infrastructure', 'Limited coaching quality', 'Family/social pressure', 'Academic commitments', 'Injury concerns', 'Competition level'], required: true },
      { id: 'financial_support', question: 'What level of financial support do you receive for football?', type: 'select', options: ['Full sponsorship/scholarship', 'Partial support', 'Family support only', 'Self-funded', 'No financial support'], required: true },
      { id: 'travel_limitations', question: 'How do travel costs affect your opportunities?', type: 'select', options: ['Not a problem', 'Minor limitation', 'Major barrier', 'Completely prevents opportunities', 'Never needed to travel'], required: true },
      
      // Goals & Aspirations
      { id: 'professional_goal', question: 'What is your ultimate football goal?', type: 'select', options: ['Play for national team', 'European professional league', 'Local professional league', 'Semi-professional level', 'College/university football', 'Just improve skills', 'Coaching career'], required: true },
      { id: 'confidence_level', question: 'How confident are you about achieving your football dreams?', type: 'select', options: ['Extremely confident', 'Very confident', 'Moderately confident', 'Somewhat uncertain', 'Not very confident'], required: true },
      { id: 'timeline_expectation', question: 'In how long do you expect to achieve your main goal?', type: 'select', options: ['Within 1 year', '1-2 years', '3-5 years', '5-10 years', 'No specific timeline', 'Unlikely to happen'], required: true },
      
      // Support System
      { id: 'family_support', question: 'Is your family supportive of your football ambitions?', type: 'boolean', required: true },
      { id: 'mentor_availability', question: 'Do you have mentors or role models in football?', type: 'boolean', required: true },
      
      // Additional Insights
      { id: 'education_balance', question: 'How do you balance football with education/work?', type: 'select', options: ['Football is priority', 'Balanced approach', 'Education/work is priority', 'Struggling to balance', 'One interferes with other', 'Not applicable'], required: true },
      { id: 'success_definition', question: 'How would you define success in football for yourself?', type: 'textarea', required: true },
      { id: 'additional_comments', question: 'Any additional comments or specific help you need?', type: 'textarea', required: false }
    ]
  },
  {
    role: 'ex-player',
    questions: [
      // Background & Career History
      { id: 'stop_age', question: 'At what age did you stop playing organized football?', type: 'number', required: true },
      { id: 'peak_level', question: 'What was the highest level you played at?', type: 'select', options: ['International Level', 'Professional League', 'Semi-Professional', 'Regional/State Level', 'Local/Community Level', 'School/University Level'], required: true },
      { id: 'years_played', question: 'How many years did you play organized football?', type: 'select', options: ['Less than 5 years', '5-10 years', '11-15 years', '16-20 years', 'More than 20 years'], required: true },
      { id: 'primary_position', question: 'What was your primary playing position?', type: 'select', options: ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker', 'Utility Player'], required: true },
      
      // Reasons for Stopping
      { id: 'stop_reason', question: 'What was the main reason you stopped playing?', type: 'select', options: ['Serious injury', 'Recurring injuries', 'Lack of opportunities', 'Financial reasons', 'Family obligations', 'Career change', 'Lost motivation', 'Age factor', 'Academic priorities', 'Other personal reasons'], required: true },
      { id: 'regret_level', question: 'Do you regret stopping when you did?', type: 'select', options: ['Yes, deeply regret it', 'Yes, somewhat regret it', 'Mixed feelings', 'No, it was right time', 'No, happy with decision'], required: true },
      { id: 'could_have_continued', question: 'Could you have continued playing at some level?', type: 'select', options: ['Yes, definitely', 'Yes, with different circumstances', 'Maybe, unsure', 'No, not really possible', 'No, completely done'], required: true },
      
      // Current Relationship with Football
      { id: 'still_follow', question: 'How closely do you follow football now?', type: 'select', options: ['Very closely, watch everything', 'Follow regularly', 'Occasionally watch', 'Rarely follow', 'Not interested anymore'], required: true },
      { id: 'local_involvement', question: 'Are you involved in local football in any way?', type: 'select', options: ['Yes, as coach/trainer', 'Yes, as administrator', 'Yes, as volunteer', 'Yes, as supporter/fan', 'No, but interested', 'No, not involved'], required: true },
      { id: 'recreational_playing', question: 'Do you still play football recreationally?', type: 'select', options: ['Yes, regularly', 'Yes, occasionally', 'Rarely', 'Stopped due to age/injury', 'Never recreational'], required: true },
      
      // Mentoring & Giving Back
      { id: 'mentoring_interest', question: 'Would you be interested in mentoring young players?', type: 'select', options: ['Definitely yes, very interested', 'Yes, if time permits', 'Maybe, depends on situation', 'Probably not', 'Definitely not interested'], required: true },
      { id: 'mentoring_capacity', question: 'In what capacity would you prefer to help young players?', type: 'select', options: ['Formal coaching', 'Technical training', 'Mental/motivational support', 'Career guidance', 'Networking/connections', 'Financial support', 'All of the above'], required: true },
      { id: 'youth_identification', question: 'How good are you at spotting talent in young players?', type: 'select', options: ['Excellent eye for talent', 'Pretty good at it', 'Average ability', 'Not very good', 'No experience with this'], required: true },
      
      // Insights & Barriers
      { id: 'biggest_barrier', question: 'What was your biggest barrier as a player?', type: 'select', options: ['Lack of exposure', 'Financial constraints', 'Poor coaching', 'Limited facilities', 'No professional pathway', 'Family/social pressure', 'Injuries', 'Mental pressure', 'Geographic isolation'], required: true },
      { id: 'system_problems', question: 'What are the biggest problems with the football system you experienced?', type: 'select', options: ['Lack of scouting networks', 'Corruption/favoritism', 'Poor youth development', 'Limited opportunities', 'Inadequate facilities', 'No financial support', 'Poor competition structure', 'Lack of professionalism'], required: true },
      { id: 'success_factors', question: 'What factors were most important for success in your experience?', type: 'select', options: ['Natural talent', 'Hard work/dedication', 'Good coaching', 'Family support', 'Financial resources', 'Networking/connections', 'Mental strength', 'Lucky breaks'], required: true },
      
      // Advice & Recommendations  
      { id: 'advice_young_players', question: 'What\'s the most important advice for current young players?', type: 'textarea', required: true },
      { id: 'system_improvements', question: 'What one change would most improve opportunities for young players?', type: 'textarea', required: true },
      { id: 'personal_lessons', question: 'What\'s the most important lesson you learned from your football journey?', type: 'textarea', required: true },
      
      // Support & Resources
      { id: 'resource_gaps', question: 'What resources were you missing that could have helped?', type: 'select', options: ['Professional coaching', 'Video analysis', 'Mental training', 'Nutritional guidance', 'Injury prevention', 'Career planning', 'Financial support', 'Networking opportunities'], required: true },
      { id: 'platform_interest', question: 'Would you use a platform to help young players connect with opportunities?', type: 'select', options: ['Yes, very interested', 'Yes, if easy to use', 'Maybe, depends on features', 'Probably not', 'Not interested'], required: true },
      
      { id: 'additional_insights', question: 'Any other insights or experiences you\'d like to share?', type: 'textarea', required: false }
    ]
  },
  {
    role: 'coach',
    questions: [
      // Background & Experience
      { id: 'experience_years', question: 'How many years of coaching experience do you have?', type: 'select', options: ['Less than 1 year', '1-2 years', '3-5 years', '6-10 years', '11-15 years', 'More than 15 years'], required: true },
      { id: 'coaching_level', question: 'What is the highest level you have coached at?', type: 'select', options: ['Professional/Semi-Professional', 'Regional/State Level', 'Local Club Level', 'Youth Academy', 'School Level', 'Community/Grassroots'], required: true },
      { id: 'age_groups', question: 'What age groups do you primarily coach?', type: 'select', options: ['Under 12', 'Under 15', 'Under 18', 'Under 21', 'Senior/Adult', 'Mixed age groups', 'All ages'], required: true },
      { id: 'players_count', question: 'How many players are currently under your training?', type: 'select', options: ['1-10', '11-25', '26-50', '51-100', 'More than 100', 'Varies significantly'], required: true },
      
      // Coaching Background
      { id: 'playing_background', question: 'What was your playing background?', type: 'select', options: ['Professional player', 'Semi-professional player', 'Amateur competitive', 'Recreational only', 'Never played organized football'], required: true },
      { id: 'coaching_education', question: 'What coaching qualifications do you have?', type: 'select', options: ['Advanced coaching license', 'Basic coaching certificate', 'Sport science degree', 'Self-taught experience', 'Learning through mentorship', 'No formal qualifications'], required: true },
      { id: 'coaching_style', question: 'How would you describe your coaching philosophy?', type: 'select', options: ['Technical skill development', 'Tactical awareness focus', 'Physical conditioning priority', 'Mental/psychological approach', 'Holistic player development', 'Win-at-all-costs', 'Fun and participation'], required: true },
      
      // Current Challenges
      { id: 'biggest_challenge', question: 'What is your biggest challenge as a coach?', type: 'select', options: ['Limited facilities/equipment', 'Player commitment/attendance', 'Financial constraints', 'Lack of support staff', 'Parent interference', 'Player skill levels', 'Time constraints', 'Administrative duties'], required: true },
      { id: 'resource_limitations', question: 'What resources do you lack most?', type: 'select', options: ['Quality training facilities', 'Equipment (balls, cones, etc.)', 'Video analysis tools', 'Medical/physio support', 'Assistant coaches', 'Transportation', 'Financial support', 'Educational materials'], required: true },
      { id: 'facility_quality', question: 'How would you rate your training facilities?', type: 'select', options: ['Excellent', 'Good', 'Average', 'Below average', 'Poor', 'No proper facilities'], required: true },
      
      // Player Development
      { id: 'talent_identification', question: 'How do you identify talent in players?', type: 'select', options: ['Technical skills', 'Athletic ability', 'Game intelligence', 'Mental toughness', 'Work ethic', 'Leadership qualities', 'Combination of factors'], required: true },
      { id: 'success_stories', question: 'Have any of your players achieved significant success?', type: 'boolean', required: true },
      { id: 'use_video_analysis', question: 'Do you use video analysis in your coaching?', type: 'boolean', required: true },
      { id: 'player_progression', question: 'What percentage of your players show significant improvement?', type: 'select', options: ['More than 80%', '60-80%', '40-60%', '20-40%', 'Less than 20%', 'Hard to measure'], required: true },
      
      // Scouting & Exposure
      { id: 'scout_visits', question: 'How often do scouts visit your training/matches?', type: 'select', options: ['Regularly', 'Occasionally', 'Rarely', 'Never', 'Don\'t know/not aware'], required: true },
      { id: 'player_promotion', question: 'How do you help players get exposure?', type: 'select', options: ['Contact scouts directly', 'Organize showcase events', 'Video highlights', 'Tournament participation', 'Network connections', 'Social media promotion', 'Don\'t actively promote'], required: true },
      { id: 'networking', question: 'How strong is your network in football?', type: 'select', options: ['Very strong connections', 'Good network', 'Moderate connections', 'Limited network', 'Very few connections', 'Isolated/no network'], required: true },
      
      // System & Structure Issues
      { id: 'system_problems', question: 'What are the biggest problems with the current football system?', type: 'select', options: ['Lack of proper structure', 'Corruption/favoritism', 'Poor youth development', 'Limited pathways to professional', 'Inadequate facilities', 'No financial support', 'Poor competition organization'], required: true },
      { id: 'competition_quality', question: 'How would you rate the quality of local competitions?', type: 'select', options: ['Excellent standard', 'Good quality', 'Average level', 'Below standard', 'Poor quality', 'No proper competitions'], required: true },
      { id: 'administrative_support', question: 'How much support do you get from football administration?', type: 'select', options: ['Excellent support', 'Good support', 'Some support', 'Limited support', 'No support', 'Actually creates obstacles'], required: true },
      
      // Innovation & Technology
      { id: 'technology_use', question: 'How do you use technology in coaching?', type: 'select', options: ['Video analysis regularly', 'Performance tracking apps', 'Online learning resources', 'Social media for promotion', 'Basic recording only', 'Don\'t use technology'], required: true },
      { id: 'learning_resources', question: 'What are your main sources for improving coaching knowledge?', type: 'select', options: ['Online courses/videos', 'Coaching clinics', 'Mentorship from experienced coaches', 'Books and manuals', 'Trial and error', 'Player feedback', 'Limited learning opportunities'], required: true },
      
      // Vision & Goals
      { id: 'coaching_goals', question: 'What are your main goals as a coach?', type: 'select', options: ['Develop professional players', 'Improve player skills', 'Build character/life skills', 'Win competitions', 'Promote football in community', 'Personal career advancement', 'All of the above'], required: true },
      { id: 'success_measurement', question: 'How do you measure your success as a coach?', type: 'select', options: ['Players going professional', 'Team performance/wins', 'Individual skill improvement', 'Player enjoyment/retention', 'Community impact', 'Personal satisfaction', 'Recognition from peers'], required: true },
      
      { id: 'improvement_suggestions', question: 'What would most improve football development in your area?', type: 'textarea', required: true },
      { id: 'coaching_advice', question: 'What advice would you give to new coaches?', type: 'textarea', required: true },
      { id: 'additional_thoughts', question: 'Any other thoughts or experiences to share?', type: 'textarea', required: false }
    ]
  },
  {
    role: 'scout',
    questions: [
      // Background & Experience
      { id: 'scouting_experience', question: 'How many years have you been involved in scouting?', type: 'select', options: ['Less than 1 year', '1-3 years', '4-7 years', '8-15 years', 'More than 15 years'], required: true },
      { id: 'organization_type', question: 'What type of organization do you work with?', type: 'select', options: ['Professional Club', 'Talent Agency/Management', 'Independent Scout', 'Football Academy', 'Regional/National Association', 'Media/Analysis', 'Other'], required: true },
      { id: 'geographic_coverage', question: 'What geographic area do you primarily cover?', type: 'select', options: ['Local area only', 'Regional/State level', 'National coverage', 'Multiple countries', 'Continental scope', 'International'], required: true },
      { id: 'employment_status', question: 'What is your employment status in scouting?', type: 'select', options: ['Full-time professional', 'Part-time professional', 'Freelance/Contract', 'Voluntary basis', 'Side activity', 'Consultant'], required: true },
      
      // Scouting Activity
      { id: 'players_scouted', question: 'Approximately how many players have you scouted in total?', type: 'select', options: ['Less than 50', '50-200', '201-500', '501-1000', 'More than 1000'], required: true },
      { id: 'african_focus', question: 'What percentage of your scouting focuses on African players?', type: 'select', options: ['More than 80%', '60-80%', '40-60%', '20-40%', 'Less than 20%', 'None specifically'], required: true },
      { id: 'age_focus', question: 'What age groups do you primarily scout?', type: 'select', options: ['Under 16', 'Under 18', 'Under 21', '18-23 years', '24+ years', 'All ages', 'Depends on assignment'], required: true },
      
      // Scouting Methods
      { id: 'scouting_methods', question: 'What are your primary scouting methods? (Select all that apply)', type: 'checkbox', options: ['Live match observation', 'Video analysis', 'Tournament scouting', 'Academy visits', 'Coach recommendations', 'Player databases', 'Social media research'], required: true },
      { id: 'technology_usage', question: 'How much do you rely on technology for scouting?', type: 'select', options: ['Heavily technology-dependent', 'Moderate technology use', 'Basic tools only', 'Minimal technology', 'Traditional methods only'], required: true },
      { id: 'video_importance', question: 'How important is video footage in your evaluation process?', type: 'select', options: ['Essential, can\'t scout without it', 'Very important', 'Moderately important', 'Somewhat useful', 'Not very important', 'Prefer live observation'], required: true },
      
      // Success & Outcomes
      { id: 'success_rate', question: 'What percentage of players you scout get professional opportunities?', type: 'select', options: ['More than 50%', '25-50%', '10-25%', '5-10%', 'Less than 5%', 'Hard to track'], required: true },
      { id: 'recent_successes', question: 'How many players have you helped place in professional clubs recently?', type: 'select', options: ['More than 20', '10-20', '5-10', '1-5', 'None yet', 'Don\'t track placements'], required: true },
      { id: 'placement_level', question: 'At what level do you typically place players?', type: 'select', options: ['Top tier professional', 'Second tier professional', 'Third tier/semi-pro', 'Youth academies', 'Development programs', 'Various levels'], required: true },
      
      // Challenges & Barriers
      { id: 'biggest_challenges', question: 'What are your biggest challenges in scouting African talent?', type: 'select', options: ['Limited access to quality footage', 'Geographic/travel constraints', 'Poor documentation/records', 'Language barriers', 'Cultural differences', 'Visa/legal issues', 'Financial constraints', 'Competition from other scouts'], required: true },
      { id: 'infrastructure_issues', question: 'How do infrastructure issues affect your scouting?', type: 'select', options: ['Major obstacle', 'Significant challenge', 'Moderate impact', 'Minor issue', 'Not a problem', 'Can work around it'], required: true },
      { id: 'information_reliability', question: 'How reliable is the information you get about players?', type: 'select', options: ['Very reliable', 'Generally reliable', 'Mixed reliability', 'Often unreliable', 'Very unreliable', 'Hard to verify'], required: true },
      
      // Talent Evaluation
      { id: 'key_attributes', question: 'What attributes do you prioritize most when scouting?', type: 'select', options: ['Technical skills', 'Physical attributes', 'Mental strength', 'Game intelligence', 'Adaptability', 'Leadership qualities', 'Potential for development'], required: true },
      { id: 'overlooked_talent', question: 'How much talent do you think goes unnoticed?', type: 'select', options: ['Massive amounts', 'Significant talent missed', 'Moderate amounts', 'Some talent missed', 'Most talent is found', 'Depends on location'], required: true },
      { id: 'talent_quality', question: 'How would you rate the overall quality of talent you encounter?', type: 'select', options: ['Exceptional quality', 'High quality', 'Good quality', 'Mixed quality', 'Below expectations', 'Varies by region'], required: true },
      
      // Market & Industry
      { id: 'market_trends', question: 'How has the scouting market changed in recent years?', type: 'select', options: ['Much more competitive', 'More professional', 'Technology-driven', 'Globalized', 'More accessible', 'Not much change', 'Becoming more difficult'], required: true },
      { id: 'competition_level', question: 'How competitive is the scouting environment?', type: 'select', options: ['Extremely competitive', 'Very competitive', 'Moderately competitive', 'Not very competitive', 'Relatively easy market'], required: true },
      { id: 'network_importance', question: 'How important are personal networks in your success?', type: 'select', options: ['Absolutely essential', 'Very important', 'Moderately important', 'Somewhat useful', 'Not very important'], required: true },
      
      // Future & Innovation
      { id: 'technology_future', question: 'How do you see technology changing scouting?', type: 'select', options: ['Will revolutionize everything', 'Significant improvements coming', 'Gradual positive changes', 'Some useful innovations', 'Won\'t change much', 'May complicate things'], required: true },
      { id: 'ai_impact', question: 'What impact do you think AI will have on scouting?', type: 'select', options: ['Will replace human scouts', 'Will enhance human scouting', 'Useful for data analysis', 'Limited practical impact', 'Not relevant to scouting'], required: true },
      
      { id: 'improvement_suggestions', question: 'What would most improve the talent discovery process in Africa?', type: 'textarea', required: true },
      { id: 'advice_aspiring_scouts', question: 'What advice would you give to someone wanting to become a scout?', type: 'textarea', required: true },
      { id: 'industry_insights', question: 'Any other insights about the scouting industry you\'d like to share?', type: 'textarea', required: false }
    ]
  },
  {
    role: 'investor',
    questions: [
      // Background & Experience
      { id: 'investment_experience', question: 'How much experience do you have with sports investments?', type: 'select', options: ['Extensive experience', 'Moderate experience', 'Some experience', 'Limited experience', 'No prior experience'], required: true },
      { id: 'football_investment_history', question: 'Have you invested in football before?', type: 'select', options: ['Yes, multiple times', 'Yes, once before', 'Currently considering first investment', 'No, but very interested', 'No, just exploring'], required: true },
      { id: 'investor_type', question: 'What type of investor are you?', type: 'select', options: ['Individual/Personal investor', 'Institutional investor', 'Family office', 'Investment fund/group', 'Corporate investor', 'Government/public sector'], required: true },
      { id: 'investment_capacity', question: 'What is your typical investment range?', type: 'select', options: ['Under $10K', '$10K-$50K', '$50K-$200K', '$200K-$1M', '$1M-$10M', 'Over $10M'], required: true },
      
      // Investment Focus & Strategy
      { id: 'investment_focus', question: 'Which areas of football interest you most for investment?', type: 'select', options: ['Individual player development', 'Youth academies', 'Professional clubs', 'Infrastructure/facilities', 'Technology/analytics', 'Media/broadcasting', 'Fan engagement platforms'], required: true },
      { id: 'geographic_preference', question: 'What geographic regions do you prefer for football investments?', type: 'select', options: ['Africa specifically', 'Emerging markets globally', 'Developed markets', 'Mixed portfolio', 'No specific preference', 'Local/domestic only'], required: true },
      { id: 'risk_appetite', question: 'How would you describe your risk tolerance for football investments?', type: 'select', options: ['High risk, high reward', 'Moderate risk', 'Conservative approach', 'Risk-averse', 'Varies by opportunity'], required: true },
      
      // African Football Perspective
      { id: 'africa_potential', question: 'How do you view the investment potential of African football?', type: 'select', options: ['Exceptional opportunity', 'High potential', 'Good opportunity', 'Moderate potential', 'Low potential', 'Too risky'], required: true },
      { id: 'africa_challenges', question: 'What do you see as the biggest challenges for investing in African football?', type: 'select', options: ['Political/regulatory risks', 'Infrastructure limitations', 'Market size/revenue potential', 'Cultural/business differences', 'Lack of transparency', 'Currency/economic instability', 'Limited exit strategies'], required: true },
      { id: 'africa_advantages', question: 'What advantages do you see in African football investments?', type: 'select', options: ['Abundant raw talent', 'Lower entry costs', 'Growing market potential', 'Less competition', 'Government support', 'Cultural passion for football', 'Untapped potential'], required: true },
      
      // Investment Criteria & Due Diligence
      { id: 'key_factors', question: 'What factors are most important in your investment decisions?', type: 'select', options: ['ROI potential', 'Market size', 'Management team quality', 'Scalability', 'Social impact', 'Risk assessment', 'Exit strategy clarity'], required: true },
      { id: 'due_diligence', question: 'How thorough is your due diligence process?', type: 'select', options: ['Very comprehensive', 'Thorough analysis', 'Standard checks', 'Basic evaluation', 'Minimal due diligence', 'Depends on investment size'], required: true },
      { id: 'timeline_preference', question: 'What is your preferred investment timeline?', type: 'select', options: ['Less than 2 years', '2-5 years', '5-10 years', '10+ years', 'No specific timeline', 'Depends on opportunity'], required: true },
      
      // Returns & Expectations
      { id: 'return_expectations', question: 'What returns do you typically expect from football investments?', type: 'select', options: ['20%+ annually', '15-20% annually', '10-15% annually', '5-10% annually', 'Break-even acceptable', 'Primarily social returns'], required: true },
      { id: 'success_metrics', question: 'How do you measure investment success?', type: 'select', options: ['Financial returns only', 'Player development success', 'Market impact', 'Social/community impact', 'Brand value creation', 'Multiple metrics'], required: true },
      { id: 'exit_strategy', question: 'What exit strategies do you prefer?', type: 'select', options: ['Sale to larger entity', 'Public offering', 'Management buyout', 'Strategic partnership', 'Long-term holding', 'No specific exit plan'], required: true },
      
      // Market Understanding & Networks
      { id: 'market_knowledge', question: 'How well do you understand the football industry?', type: 'select', options: ['Expert level understanding', 'Good knowledge', 'Moderate understanding', 'Basic knowledge', 'Limited understanding', 'Learning as I go'], required: true },
      { id: 'industry_networks', question: 'How strong are your networks in football?', type: 'select', options: ['Very strong connections', 'Good network', 'Some connections', 'Limited network', 'No specific football network', 'Building connections'], required: true },
      { id: 'advisory_support', question: 'Do you have advisors with football industry expertise?', type: 'select', options: ['Yes, multiple advisors', 'Yes, one main advisor', 'Informal advisory support', 'Planning to get advisors', 'No, but open to it', 'Prefer to invest independently'], required: true },
      
      // Technology & Innovation
      { id: 'tech_interest', question: 'Are you interested in football technology investments?', type: 'select', options: ['Very interested', 'Moderately interested', 'Somewhat interested', 'Not very interested', 'Not interested at all'], required: true },
      { id: 'innovation_areas', question: 'Which football innovation areas interest you most?', type: 'select', options: ['Player analytics/performance', 'Fan engagement tech', 'Training/coaching tools', 'Scouting platforms', 'Stadium/facility tech', 'Broadcasting/media', 'Mobile/digital platforms'], required: true },
      
      // Social Impact & ESG
      { id: 'social_impact', question: 'How important is social impact in your football investments?', type: 'select', options: ['Primary motivation', 'Very important', 'Moderately important', 'Nice to have', 'Not a priority'], required: true },
      { id: 'esg_considerations', question: 'How important are ESG (Environmental, Social, Governance) factors?', type: 'select', options: ['Essential requirement', 'Very important', 'Moderate consideration', 'Some consideration', 'Not a factor'], required: true },
      
      { id: 'investment_motivations', question: 'What motivates your interest in football investments?', type: 'textarea', required: true },
      { id: 'ideal_opportunity', question: 'Describe your ideal football investment opportunity', type: 'textarea', required: true },
      { id: 'additional_perspectives', question: 'Any other thoughts on football investment opportunities?', type: 'textarea', required: false }
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
    
    console.log('Form data being submitted:', data)
    console.log('Selected role:', selectedRole)
    
    try {
      const payload = {
        role: selectedRole,
        responses: data
      }
      
      console.log('Payload being sent:', payload)
      
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Success response:', result)
        onSubmissionComplete()
      } else {
        const errorData = await response.json()
        console.log('Error response:', errorData)
        throw new Error(`Failed to submit survey: ${errorData.error || 'Unknown error'}`)
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

                        {question.type === 'boolean' && (
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                value="true"
                                {...register(question.id, { required: question.required })}
                                className="text-football-green focus:ring-football-green"
                              />
                              <span className="text-white">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                value="false"
                                {...register(question.id, { required: question.required })}
                                className="text-football-green focus:ring-football-green"
                              />
                              <span className="text-white">No</span>
                            </label>
                          </div>
                        )}

                        {question.type === 'checkbox' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={option}
                                  {...register(question.id, { required: question.required })}
                                  className="text-football-green focus:ring-football-green"
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
