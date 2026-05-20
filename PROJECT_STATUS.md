# Nucleus — Project Status

## What is Nucleus?
A personal fitness intelligence web app. Users log workouts, nutrition, and recovery data. AI (Claude API) generates weekly insights backed by real PubMed research. Built as a portfolio piece and learning project.

Developer: Adrian Botello
Repo: C:\Users\AB\Documents\GitHub\FitnessApp

---

## Tech Stack (Installed)
- **Vite 8** — build tool (fast dev server, ES Modules, HMR)
- **React 19** — UI framework (component-based, SPA)
- **Tailwind CSS 4** — utility-first styling via Vite plugin
- **React Router 7** — client-side routing (5 pages)
- **React Icons** — icon library (Heroicons for sun/moon toggle)

## Tech Stack (Not Yet Installed)
- **Recharts** — data visualization (Phase 3)
- **Supabase** — auth + PostgreSQL database (Phase 2)
- **Framer Motion** — animations (Phase 6)
- **Claude API** — AI insights (Phase 4)
- **PubMed API** — research citations (Phase 5)

---

## What's Been Built (Phase 1 — In Progress)

### Project Foundation
- Vite + React scaffolded with `npm create vite@latest . -- --template react`
- Tailwind CSS wired into Vite via `@tailwindcss/vite` plugin in `vite.config.js`
- Custom theme defined in `src/index.css` using `@theme` block (colors, fonts)
- Google Fonts loaded in `index.html` — DM Sans (body) + Space Grotesk (headings)

### Routing
- React Router configured in `src/App.jsx` with `BrowserRouter`
- 5 routes: `/` (Dashboard), `/log`, `/insights`, `/progress`, `/research`
- All navigation uses `<NavLink>` for client-side routing (no page reloads)

### Layout
- Responsive Navbar in `src/components/Navbar.jsx`
  - Desktop: fixed sidebar (240px) on the left
  - Mobile: fixed bottom nav bar
  - Active page highlighted with accent color
- Main content area offsets from navbar (`md:pl-60` / `pb-16`)
- Max-width container 1200px centered on all pages
- Top bar with dark/light mode toggle (fixed, blurred background)

### Dark/Light Mode
- Controlled by `useState` in `App.jsx`
- Persists to `localStorage` (survives page refresh)
- `useEffect` toggles `dark`/`light` class on `<body>`
- Light mode overrides defined in `src/index.css`
- Sun/Moon icons from `react-icons/hi` (Heroicons)

### Pages (All Have Rich Placeholder Content)
1. **Dashboard** (`src/pages/Dashboard.jsx`)
   - 4 stat cards (Calories, Protein, Sleep, Energy) in responsive grid
   - Current streak card
   - Weekly calories bar chart (pure CSS, no library)
   - Quick Log button linking to `/log`

2. **Log** (`src/pages/Log.jsx`)
   - 3-column form: Workout, Nutrition, Recovery
   - Styled inputs with focus states
   - Save Entry button (no functionality yet)

3. **Insights** (`src/pages/Insights.jsx`)
   - 3 placeholder AI insight cards with study citations
   - Regenerate button (no functionality yet)
   - Helper text about logging consistency

4. **Progress** (`src/pages/Progress.jsx`)
   - 5 mini bar charts: Calories, Protein, Sleep, Energy, Workout Volume
   - Reusable `MiniChart` component with props (color, data, label, unit)
   - Different colors per metric

5. **Research** (`src/pages/Research.jsx`)
   - 4 placeholder study cards with topic badges
   - Color-coded by topic (Sleep, Nutrition, Hypertrophy, Fat Loss)
   - Author, journal, year metadata

### File Structure
```
src/
  pages/
    Dashboard.jsx
    Log.jsx
    Insights.jsx
    Progress.jsx
    Research.jsx
  components/
    Navbar.jsx
  App.jsx            — Router + layout + dark mode state
  App.css            — Empty (unused, can delete)
  main.jsx           — React entry point
  index.css          — Tailwind import + theme + light mode overrides
index.html           — Google Fonts + meta tags
vite.config.js       — Vite + React + Tailwind plugins
package.json         — All dependencies
```

### Design System
- Dark: bg #080810, surface #0f0f1a, cards #16162a, accent #3B82F6
- Light: bg #f8fafc, surface #ffffff, cards #f1f5f9, accent #2563EB
- Text: primary #f1f5f9 (dark) / #0f172a (light), muted #64748b
- Hover transitions: 150ms ease
- No gradients, no glow effects

---

## What Still Needs to Be Done

### Phase 1 — Remaining (Boilerplate)
- [x] Legal disclaimer modal (first visit, stored in localStorage)
- [x] Persistent footer on every page (medical disclaimer text)
- [x] Service placeholder files: `src/services/supabase.js`, `src/services/claudeApi.js`, `src/services/pubmedApi.js`
- [x] Add icons to Navbar links (react-icons)
- [x] Initial git commit

### Phase 2 — Supabase Auth & Database
- [ ] Create Supabase project
- [ ] Implement Google login authentication
- [ ] Create database tables: `daily_logs`, `workout_entries`, `insights`
- [ ] Set up Row-Level Security (RLS) policies
- [ ] Wire Log form to save entries to Supabase
- [ ] Display saved logs on Dashboard (replace dummy data)

### Phase 3 — Progress Charts
- [ ] Install Recharts
- [ ] Replace mini bar charts with real Recharts components
- [ ] Connect charts to Supabase data
- [ ] Build all 5 chart types (line charts + bar charts)

### Phase 4 — Claude API Insights
- [ ] Pull last 7 days of logs from Supabase
- [ ] Send structured prompt to Claude API (claude-sonnet-4-20250514)
- [ ] Parse and display AI-generated insights
- [ ] Add regenerate functionality
- [ ] Handle loading and error states

### Phase 5 — PubMed API Integration
- [ ] Fetch studies from PubMed API based on insight keywords
- [ ] Display real citations on Research page
- [ ] Link each insight to its supporting study
- [ ] Organize studies by topic

### Phase 6 — Polish & Deploy
- [ ] Install and add Framer Motion animations
- [ ] Mobile testing and responsive fixes
- [ ] Deploy to Vercel (auto-deploy from GitHub)
- [ ] Environment variables for API keys
- [ ] Final UI polish

---

## Working Style
- Adrian does 60% (integration, APIs, testing, deployment — resume skills)
- Claude does 40% (repetitive boilerplate, styling, scaffolding)
- **Claude acts as a Socratic teacher** — ask questions before giving answers, explain WHY each tool is chosen over alternatives, test understanding with follow-up questions, and guide Adrian to figure things out himself rather than just handing him code
- Explain every new concept (useState, useEffect, routing, etc.) before using it
- When introducing a tool, always cover: what problem it solves, what the alternatives are, and why this one was chosen
- Treat as real SWE project: proper git, meaningful commits, interview-ready decisions
- Adrian's goal: land a tech job — every skill learned should be tied back to industry relevance
