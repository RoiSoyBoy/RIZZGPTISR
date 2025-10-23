# RizzGPTISR - The First Hebrew Dating Conversation Assistant

<div align="center">

## The Project

**RizzGPTISR is the first AI-powered dating conversation assistant in Hebrew**, specifically built for Israeli users in the dating scene 🇮🇱💕

It helps create engaging, authentic, and charismatic messages for dating apps like Tinder, Bumble, and others. The platform is powered by advanced AI (GPT-4o-mini) with deep understanding of Israeli culture and natural Hebrew conversation tone.

### A New Dating Landscape

This is the first solution of its kind in the Israeli market, filling the void left by English-only tools like PLUG.ai and RIZZ.ai that don't support Hebrew or understand local culture.

---

## ✨ Key Features

### 🎯 Personalized Message Creation
- **Two conversation context options**: Text input or screenshot upload
- **Multiple tones**: Casual, romantic, humorous, cheerful, understanding, direct, playful, confident
- **Message types**: Reply, opener, advice

### 🔥 Israel Market Focus
- **Native Hebrew language** - Full RTL support
- **Cultural understanding** - Israeli slang, holidays, local norms
- **Israeli dating optimization** - Support for all popular apps

### 🎪 Innovative Business Model
- **Free tier**: 50 messages per month +
- **Premium**: ₪29/month or ₪299/year (unlimited)
- **Hybrid monetization**: Subscription + AdSense revenue

### 🚀 Advanced Technology
- **Dedicated AI**: GPT-4o-mini with Hebrew-optimized prompts
- **Scalable architecture**: Firebase Backend with Cloud Functions
- **Security & reliability**: Firebase Auth, data encryption, rate limiting

---

## 🛠️ Technical Architecture

### Frontend (Next.js 14+)
```
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **UI/UX**: Responsive, RTL-first design
```

### Backend (Firebase)
```
- **Functions**: Cloud Functions (Node.js with TypeScript)
- **Database**: Firestore
- **Authentication**: Firebase Auth with JWT tokens
- **Hosting**: Firebase Hosting
```

### AI & Integration
```
- **Primary Model**: GPT-4o-mini (cost-optimized)
- **Fallback Model**: GPT-3.5-turbo
- **Caching**: Redis/Memory cache for performance
- **Security**: CORS, rate limiting, input validation
```

### Tech Stack Summary

**Frontend:**
- Next.js 15, React 19, TypeScript
- Tailwind CSS, shadcn/ui, Lucide React icons
- Firebase SDK (Auth, Functions, Firestore)
- Zustand state management
- Right-to-Left (RTL) Hebrew support

**Backend:**
- Firebase Cloud Functions (TypeScript)
- Firestore database with user token tracking
- OpenAI API integration
- CORS middleware for security

---

## 📁 Project Structure

```
rizz-gpt-isr/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/       # Main dashboard page
│   │   └── layout.tsx       # Root layout with auth
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   └── auth/             # Authentication forms
│   ├── context/             # React contexts (AuthContext)
│   ├── lib/                 # Firebase config & utilities
│   ├── services/            # API service layer
│   ├── store/               # Zustand state stores
│   └── types/               # TypeScript type definitions
└── functions/               # Firebase Cloud Functions
    └── src/
        └── index.ts         # AI message generation logic
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project with Firestore enabled
- OpenAI API key

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RoiSoyBoy/RIZZGPTISR.git
   cd rizz-gpt-isr
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase setup:**
   ```bash
   # Login to Firebase
   firebase login

   # Initialize project
   firebase init hosting firestore functions --project your-project-id

   # Copy your Firebase config to src/lib/firebase.ts
   # Configure your OpenAI API key in functions environment
   firebase functions:config:set openai.key="your-openai-api-key"
   ```

4. **Environment variables:**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   # Add your API keys and Firebase config
   ```

5. **Start development:**
   ```bash
   # Start Next.js frontend
   npm run dev

   # In another terminal, serve functions locally
   firebase functions:serve
   ```

6. **Deploy to production:**
   ```bash
   # Build and deploy
   npm run build
   firebase deploy
   ```

### 🌍 סביבת פיתוח בודדת - Local Development Environment

```bash
# Frontend: http://localhost:3000
npm run dev

# Firebase Emulator Suite
firebase emulators:start --only functions,firestore,auth,hosting

# Test endpoint
curl -X GET http://localhost:5001/your-project-id/us-central1/generateMessage
```

---

## 🎭 תכונות מפורטות - Detailed Features

### יצירת הודעות - Message Generation

**טייפים של הודעות:**
- **תגובה (Reply)**: תשובות חכמות להודעות קיימות
- **משפט פתיחה (Opener)**: גלולה ראשונה מושכת תשומת לב
- **ייעוץ (Advice)**: טיפים כלליים למטבי דייטינג

**טונים זמינים:**
- קז'ואל: רגוע ואותנטי
- רומנטי: מתוק ורגשי
- הומוריסטי: שנון ומשעשע
- ישיר: כן ולעניין
- משחקי: מתגרה ונעים
- בטוח: ביטחון עצמי מאוזן

### מערכת טוקנים - Token System

**תמחור:**
- **חינם**: 50 הודעות/חודש + פרסומות
- **פרמיום**: ₪29/חודש - ללא הגבלה
- **חבילת חירום**: ₪5 ל-25 הודעות נוספות

### זרימת משתמשים - User Flows

1. **הרשמה ואימות** → עמוד אוט'נטיקציה
2. **הכנסת הקשר שיחה** → דאשבורד עיקרי
3. **בחירת טון וסוג הודעה** → ממשק אינטואיטיבי
4. **יצירת הצעות** → AI יוצר מספר אפשרויות
5. **העתקה לשימוש** → שיתוף ישיר לאפליקציית דייטינג

---

## 📊 Metrics & Success

**יעדי MVP (שנה ראשונה):**
- 5,000+ משתמשים רשומים
- ₪50,000+ ARR (Annual Recurring Revenue)
- 4.5+ דירוג App Store
- 30% retention rate ל-30 יום

**יעדי גידול:**
- הרחבת לפלטפורמות אחרות (WhatsApp, Telegram)
- ניתוח תמונות פרופיל
- ישראליזציה מתקדמת (חגים, אירועים מקומיים)

---

## 🧪 פיתוח ותרומה - Development & Contribution

### פקודות שימושיות - Useful Commands

```bash
# Development
npm run dev                    # Start Next.js dev server
firebase emulators:start       # Start Firebase emulators
npm run lint                   # ESLint checking

# Building
npm run build                 # Production build
firebase functions:build      # Build Cloud Functions

# Deployment
firebase deploy               # Deploy to production
firebase functions:shell      # Test functions locally

# Testing
npm run test                  # Run unit tests (when added)
firebase functions:test       #
```

### מבנה קוד - Code Structure

**Frontend Principles:**
- Component-based architecture
- Custom hooks for API calls
- TypeScript strict mode
- Responsive mobile-first design
- Hebrew RTL optimization

**Backend Principles:**
- Serverless Cloud Functions
- Modular API endpoints
- Error handling with proper HTTP codes
- Rate limiting and security validation

---

## 📋 רשימת משימות - Roadmap

### 🚀 MVP (שלושה חודשים)
- ✅ Next.js frontend עם אוט'נטיקציה
- ✅ Firebase Functions עבור OpenAI
- ✅ מערכת טוקנים ובסיס נתונים
- 🔄 בטא טסטינג עם 100 משתמשים
- 🔄 הפצה ראשונית ב-App Store

### ⚡ שלב 2 (שישה חודשים)
- 🔄 ניתוח תמונות פרופיל
- 🔄 הצעות שיפור מתקדמות
- 🔄 Analytics וניטור שימוש
- 🔄 מונטיזציה מלאה

### 🌠 שלב 3 (שנה ראשונה)
- 🔄 WhatsApp integration
- 🔄 AI שיחות מקיים (conversation memory)
- 🔄 ישראלים הוקס ופיצ'רים מתקדמים
- 🔄 הרחבה לשווקים בינלאומיים

---

## 🤝 תרומה - Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### תורמים - Contributors
- **Roi Hatipesh** - Full-stack developer & project founder

---

## 📄 רישיון - License

This project is private and proprietary.

---

## 📞 קשר - Contact

**Roi Hatipesh**
- Email: roi@example.com
- LinkedIn: [Roi Hatipesh](https://linkedin.com/in/roi-hatipesh)
- GitHub: [@RoiSoyBoy](https://github.com/RoiSoyBoy)

### פילוסופיה - Philosophy

*"בניית האפליקציה הזו מתוך אמונה שטכנולוגיה יכולה לעזור לאנשים למצוא חיבורים אותנטיים, תוך שימור האישיות והזהות שלהם בעולם הדייטינג."*

---

<div align="center">

Made with ❤️ in Israel 🇮🇱

</div>
