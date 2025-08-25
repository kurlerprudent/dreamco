# HiddenGems - African Football Talent Platform

A modern, responsive web platform built with Next.js that connects African football talent with scouts, coaches, and investors.

## � Overview

HiddenGems highlights the problem, opportunity, and brighter future for African football talent through:
- Stunning hero section with emotional storytelling
- Statistical insights about African football
- Dynamic role-based survey system
- Anonymous data collection via MongoDB
- Professional football-themed design

## ✨ Features

### Design & UX
- **Modern Football Theme**: Green gradients, stadium textures, professional imagery
- **Responsive Design**: Optimized for desktop and mobile
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Premium UI**: Nike/FIFA World Cup website inspired aesthetics
- **Dark Theme**: Professional look with bright football-inspired accents

### Sections
1. **Hero Section**: Compelling title with call-to-action
2. **Motive & Stats**: Problem statement with impactful statistics
3. **Dynamic Survey**: Role-based questions (Player, Ex-Player, Coach, Scout, Investor)
4. **Thank You**: Motivational completion screen

### Technical Features
- **Anonymous Surveys**: No personal information collected
- **Role-based Questions**: Dynamic question sets based on user role
- **MongoDB Integration**: Secure data storage
- **Form Validation**: React Hook Form with error handling
- **Smooth Scrolling**: Enhanced navigation experience

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: TailwindCSS + ShadCN UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Database**: MongoDB
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Survey Structure

### Role Types:
1. **Football Player**
   - Age, team status, training frequency, challenges

2. **Ex-Player** 
   - Stop age/reason, mentoring interest, advice

3. **Coach**
   - Player count, coaching challenges, experience, success stories

4. **Scout/Agent**
   - Scouted player count, challenges, organization type, success rate

5. **Investor/Sponsor**
   - Previous investments, encouragement factors, investment types, budget range

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd play2pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.local` and configure:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/play2pro
   # OR for production:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/play2pro
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

**Local MongoDB:**
```bash
# Install MongoDB locally
mongod --dbpath /path/to/your/db
```

**MongoDB Atlas (Recommended for production):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env.local`

## 📁 Project Structure

```
play2pro/
├── app/
│   ├── api/survey/route.ts    # Survey submission API
│   ├── globals.css            # Global styles with football theme
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── ui/                    # ShadCN UI components
│   ├── HeroSection.tsx        # Landing hero section
│   ├── MotiveSection.tsx      # Stats and storytelling
│   ├── SurveySection.tsx      # Dynamic survey form
│   └── ThankYouSection.tsx    # Completion screen
├── types/
│   └── survey.ts              # TypeScript interfaces
├── lib/
│   └── utils.ts               # Utility functions
└── public/                    # Static assets
```

## 🎨 Design System

### Colors
- **Football Green**: `#00FF41` - Primary action color
- **Electric Blue**: `#00D4FF` - Secondary accent  
- **Neon Yellow**: `#FFFF00` - Highlight color
- **Dark Background**: Slate-900 variants

### Typography
- **Primary Font**: Inter (modern, readable)
- **Weight Scale**: Light (300) to Black (900)
- **Responsive Sizing**: Mobile-first approach

### Components
- **Glow Effects**: CSS animations for buttons and cards
- **Smooth Transitions**: 300-500ms duration
- **Hover States**: Scale transforms and color changes
- **Loading States**: Animated spinners and skeletons

## 📊 Data Collection

### Survey Schema
```javascript
{
  role: string,              // Selected user role
  responses: object,         // Key-value pairs of answers
  timestamp: Date,           // Submission time
  ip: string,               // User IP (for analytics, not tracking)
  userAgent: string         // Browser info
}
```

### Privacy
- ✅ **No personal information** collected
- ✅ **Anonymous responses** only
- ✅ **No email/phone** requirements
- ✅ **IP anonymization** for analytics only

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production
```bash
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://yourdomain.com
```

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint checking
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (optional)

## 🎯 Future Enhancements

- [ ] Real-time survey analytics dashboard
- [ ] Multi-language support (English, French, Arabic)
- [ ] Social media sharing integration
- [ ] Email notification system for stakeholders
- [ ] Advanced filtering and reporting
- [ ] Mobile app version
- [ ] AI-powered insights from survey data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- African football community for inspiration
- Football legends who paved the way
- Open source community for amazing tools
- Design inspiration from Nike and FIFA

---

**Play2Pro** - *Talent Beyond the Spotlight* ⚽✨
