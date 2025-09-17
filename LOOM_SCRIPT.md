# 🎥 Loom Video Script - Undergraduation Admin Dashboard Demo

**Duration:** 6-8 minutes  
**Target Audience:** Undergraduation.com hiring team  
**Purpose:** Demonstrate the CRM dashboard functionality and technical implementation

---

## 🎬 **Video Structure & Timing**

### **1. Introduction (0:00 - 1:00)**
**Script:**
> "Hi! I'm Srikar Sistla, and I'm excited to present the Undergraduation Admin Dashboard I built for your technical assessment. This is a lightweight internal CRM dashboard designed to help your team manage student interactions and track application progress. Let me show you what I've built."

**Actions:**
- Show the login page
- Point out the Undergraduation branding and professional design
- Mention it's running locally at localhost:3000

### **1A. Product context & fit (optional 0:20–0:30)**
**Script:**
> "Undergraduation’s student experience at [my.undergraduation.com](https://my.undergraduation.com/) is simple and welcoming. I designed this admin to mirror that clarity for counselors: fast search, one‑click follow‑ups, and inline edits. The goal is to help your team move faster without adding complexity, so students get support sooner."

**Actions:**
- Briefly show Students → clean layout, then back

---

### **2. Authentication & Login (1:00 - 1:20)**
**Script:**
> "The dashboard uses Firebase Auth (email/password). I'll sign in with a demo user we created in Firebase. Routes are protected, so unauthenticated users are redirected to login."

**Actions:**
- Enter email/password and sign in
- Show the transition to the main dashboard
- Point out the header with navigation

---

### **3. Student Directory Overview (1:30 - 3:10)**
**Script:**
> "Here's the main student directory — search, filter, and sort students. Columns include Last Communication and Communications Count in addition to the basics."

**Actions:**
- Show the student table
- Point out new columns (Last Comm, Comms)
- Show the summary statistic cards at the top

**Script:**
> "Search works across name, email, and country. Quick filters include Not contacted ≥7d, High intent, and Needs essay help. Sorting can be switched to Last Comm or Comms Count, and the arrow toggles direction."

**Actions:**
- Type in search; show status filter dropdown
- Click quick filters (show Not contacted ≥7d uses last-communication date)
- Change sort key and toggle direction

---

### **4. Individual Student Profile (3:10 - 5:30)**
**Script:**
> "Let me click on a student to show you the individual profile view. This is where your team will spend most of their time managing each student's journey."

**Actions:**
- Click "View →" on a student
- Show the profile page

**Script:**
> "The profile starts with basic information — name, email, phone, grade, country, and current application status. The progress bar shows the application stage, and I can update it inline."

**Actions:**
- Point to the basic info section
- Show the progress bar
- Change status and click Update (show toast)

**Script:**
> "Notes are inline editable — click the ✏️ to edit, Save/Cancel, or Delete."

**Actions:**
- Go to Notes
- Add a note, edit it inline, then delete one note

**Script:**
> "Tasks support inline editing — title, status (pending/done), and due date, with validation."

**Actions:**
- Go to Tasks
- Add a task with a due date, then click ✏️ and edit fields inline

**Script:**
> "The Communications tab logs all interactions. I'll add a manual email. The 'Send follow‑up' button calls Customer.io (soft‑fail safe) and still records the comm and counters."

**Actions:**
- Go to Communications
- Add a manual communication
- Click "Send follow‑up" and show a new record added

---

### **5. Insights & Analytics (5:30 - 6:50)**
**Script:**
> "Insights provide at‑a‑glance analytics and pipeline health."

**Actions:**
- Navigate to Insights
- Show metric cards

**Script:**
> "Application Progress and Status Distribution visualize where students are. The 14‑day trend is multi‑series (All, Email, SMS, Call) with smoothing and an area under ‘All’. Click the legend to focus on a single channel; hover shows tooltips. Below, the Follow‑up list surfaces students not contacted ≥7 days."

**Actions:**
- Interact with the trend: click legend to isolate Email/SMS, hover to show tooltip
- Point out the Follow‑up list

---

### **6. Technical Implementation (6:50 - 7:40)**
**Script:**
> "Under the hood: Next.js 15 + TypeScript + Firebase (Auth + Firestore). Optional FastAPI backend is included, but the UI talks directly to Firestore."

**Actions:**
- Show `src/lib/firebaseDb.ts` (typed data access)
- Show `src/components/AuthGate.tsx` (route protection)
- Show `src/app/api/followup/route.ts` (Customer.io soft‑fail, client persists comm)

**Script:**
> "Notes and tasks use inline editing; communications update `students` counters (`communicationsCount`, `lastCommunicationAt`). Setup details (env, indexes, seed route) are in the README."

---

### **7. Conclusion & Next Steps (7:40 - 8:00)**
**Script:**
> "Undergraduation’s student app is approachable — this admin deliberately matches that ethos so counselors can move faster and help more students. I’ve already shipped the core workflow end‑to‑end (Auth → Directory → Profile → Insights) and can keep the velocity high on your roadmap. I’d love to bring this same builder mindset to your team."

**Actions:**
- Show README briefly
- End on the main dashboard

---

## 🎯 **Key Points to Emphasize**

### **Technical Excellence**
- ✅ Next.js 15 with App Router
- ✅ TypeScript + Firebase Auth/Firestore
- ✅ Tailwind CSS + reusable UI library
- ✅ Clean, typed data access layer
- ✅ Responsive and accessible design

### **Feature Completeness**
- ✅ Directory: search, filters, sorting (Last Comm, Comms count)
- ✅ Profiles: notes (inline edit), tasks (inline edit), comms + follow‑up
- ✅ Progress tracking
- ✅ Insights: charts + follow‑up list
- ✅ Customer.io (soft‑fail safe)

### **Production Ready**
- ✅ README with env/indexes/seed
- ✅ Error handling and toasts
- ✅ Route protection and auth guard

---

## 📝 **Pre-Recording Checklist**

- [ ] App running on localhost:3000 (or Vercel)
- [ ] Firebase user exists; Authorized domains include localhost/Vercel domain
- [ ] Firestore rules published; 4 composite indexes created
- [ ] Optional: set Customer.io keys; otherwise soft‑fail is fine
- [ ] Seed data created via `/admin/seed`
- [ ] Browser clean (no dev tools), 100% zoom, full-screen window

---

## 🎬 **Recording Tips**

1. Speak clearly and keep a steady pace
2. Demonstrate each feature (don’t just narrate)
3. Use cursor highlighting; pause briefly after sections
4. Keep focus on the assessment requirements

---

## 📋 **Post-Recording**

1. Review the video for clarity
2. Trim dead time at start/end
3. Title: "Undergraduation Admin Dashboard Demo — Srikar Sistla"
4. Share the Loom link in your submission

---

**Good luck with your demo! 🚀**
