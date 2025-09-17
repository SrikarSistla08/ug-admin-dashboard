# Undergraduation Admin Dashboard

A lightweight internal CRM dashboard for managing student interactions on undergraduation.com. Built with Next.js 15, TypeScript, Tailwind CSS, Firebase (Auth + Firestore), and optional FastAPI backend.

## 🚀 Features

### Student Directory View
- **Table view** with search, filtering, and sorting
- **Key columns**: Name, Email, Country, Application Status, Last Active, Last Communication, Communications Count
- **Quick filters**: "Students not contacted in 7 days", "High intent", "Needs essay help"
- **Click to view** individual student profiles

### Student Individual Profile View
- **Basic Info**: Name, email, phone, grade, country
- **Interaction Timeline**: Login activity, AI questions asked, documents submitted
- **Communication Log**: Emails, SMS with manual logging
- **Internal Notes**: Add, edit, delete team notes
- **Progress Tracking**: Visual progress bar based on application stage

### Communication Tools
- **Manual Communication Logging**: Log calls, emails, SMS
- **Follow-up Emails**: Customer.io call (soft-fails gracefully if not configured)
- **Task Management**: Schedule reminders and tasks for internal team

### Insights & Analytics
- **Summary Statistics**: Active students, status breakdowns
- **Charts**: Status bar/pie, 14‑day multi-series trend (All/Email/SMS/Call) with smoothing, area fill, hover tooltip, legend click-to-filter, and follow-up candidates list
- **Application Progress**: Track students through "Exploring" → "Shortlisting" → "Applying" → "Submitted"

### UI/UX Features
- **Modern Design**: Friendly, responsive layout
- **Smooth Interactions**: Hover/active states, toasts
- **Authentication**: Firebase Auth (email/password)
- **Professional Header/Footer**: Branded navigation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Custom component library (Button, Card, Badge, Input, Select, Progress, Tabs, Toast, Avatar)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Email Integration**: Customer.io (soft-fail in dev)
- **Backend (optional)**: FastAPI in `backend/`
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Management**: React Hook Form
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ug-admin-dashboard
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure Environment
Create `.env.local` in the project root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Customer.io (optional)
NEXT_PUBLIC_CUSTOMER_IO_SITE_ID=...
CUSTOMER_IO_API_KEY=...
CUSTOMER_IO_REGION=us
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### Getting Started
**Demo Username: demousr1@gmail.com**
***Demo Password: 123demo321***
1. **Login**: Sign in with your Firebase Auth user (create one in Console → Authentication → Users)
2. **Student Directory**: View all students with search and filters
3. **Student Profile**: Click "View →" to see individual student details
4. **Insights**: Navigate to Insights page for analytics

### Key Features

#### Student Directory
- **Search**: Filter by name, email, or country
- **Status Filter**: Filter by application status
- **Quick Filters**: Not contacted ≥7d, High intent, Needs essay help
- **Sorting**: Toggle by Last Active, Last Comm, Comms Count, or Name; arrow toggles asc/desc
- **View Profile**: Click "View →" to open individual student profile

#### Student Profile
- **Basic Info**: View student contact details and current status
- **Progress Bar**: Visual representation of application stage
- **Update Status**: Change student's application stage
- **Timeline Tab**: See interaction history (logins, AI questions, document uploads)
- **Communications Tab**: Log and view all communications
- **Notes Tab**: Add, edit, delete internal team notes
- **Tasks Tab**: Create and manage tasks for the student

#### Communication Tools
- **Log Communication**: Add emails, calls, or SMS
- **Send Follow-up**: `/api/followup` soft-calls Customer.io and still records locally
- **Add Tasks**: Create reminders with inline edit for title/status/due date

#### Insights Dashboard
- **Key Metrics**: View total students, not contacted, high intent, needs essay help
- **Status Distribution**: Visual breakdown of application stages
- **Application Progress**: Progress bars for each status
- **Detailed Table**: Comprehensive view of all students

## 🏗️ Project Structure

```
ug-admin-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── followup/      # Mock Customer.io endpoint
│   │   ├── insights/          # Analytics page
│   │   ├── login/             # Authentication page
│   │   ├── students/          # Student directory and profiles
│   │   │   └── [id]/          # Individual student pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page (redirects to login)
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI component library
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── Toast.tsx
│   │   ├── AuthControls.tsx   # Authentication controls
│   │   ├── AuthGate.tsx       # Route protection
│   │   ├── Footer.tsx         # Site footer
│   │   └── Header.tsx         # Site header
│   ├── data/
│   │   └── mockDb.ts          # In-memory database
│   └── domain/
│       └── types.ts           # TypeScript type definitions
├── public/
│   └── download.png           # Undergraduation logo
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Firebase Setup
1. Firebase Console → Authentication → Enable Email/Password; add a user.
2. Firestore → Rules (dev):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
3. Composite Indexes (Collection / Fields):
   - `interactions` → `studentId Asc, createdAt Desc`
   - `communications` → `studentId Asc, createdAt Desc`
   - `notes` → `studentId Asc, createdAt Desc`
   - `tasks` → `studentId Asc, createdAt Desc`

### Seed Data
- While signed in, visit `/admin/seed` to add 10 sample students with interactions, communications, tasks, and notes.

### Mock Data
The application includes seeded data with 10 sample students across different application stages. Data is stored in memory and resets on server restart.

## 🎨 Customization

### UI Components
All UI components are in `src/components/ui/` and can be customized:
- **Colors**: Modify Tailwind classes in component files
- **Spacing**: Adjust padding, margins, and gaps
- **Animations**: Customize transition durations and effects

### Data Model
Types are defined in `src/domain/types.ts`:
- `Student`: Core student information
- `Interaction`: Login, AI questions, document uploads
- `Communication`: Emails, SMS, calls
- `Note`: Internal team notes
- `Task`: Reminders and tasks

### Mock Database
Database operations are in `src/data/mockDb.ts`:
- CRUD operations for all entities
- Seeded sample data
- Ready to replace with Firebase Firestore

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Features
1. **New Pages**: Add to `src/app/`
2. **New Components**: Add to `src/components/`
3. **New Types**: Add to `src/domain/types.ts`
4. **New API Routes**: Add to `src/app/api/`

## 🔮 Future Enhancements

### Production Ready
- [ ] Role-based rules (admin claims), App Check
- [ ] Customer.io templates and delivery status
- [ ] Add data validation with Zod
- [ ] Implement error boundaries
- [ ] Add loading states and skeletons

### Additional Features
- [ ] Bulk operations (export, mass updates)
- [ ] Advanced filtering and sorting
- [ ] Email templates and automation
- [ ] Real-time notifications
- [ ] Data export (CSV, PDF)
- [ ] Mobile app (React Native)

## 📞 Support

For questions or issues:
1. Check the code comments for implementation details
2. Review the type definitions in `src/domain/types.ts`
3. Examine the mock database in `src/data/mockDb.ts`

## 📄 License

This project is built for Undergraduation.com as part of a technical assessment.

---

**Built with ❤️ for student success**
