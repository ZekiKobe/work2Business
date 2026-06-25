# Work2Business

**Turn your employment experience into a profitable business — powered by AI.**

Work2Business is a full-stack web platform that helps employees discover the right business to start, generates personalized AI-powered business plans, and tracks their journey from employment to entrepreneurship.

---

## What It Does

A professional fills out a 6-step onboarding profile covering their skills, available capital, current salary, weekly hours, and business interests. The platform's 6-factor scoring engine matches them against 15+ curated business ideas and ranks each one by how well it fits their exact situation. From any match, they can generate a complete GPT-4o business plan in under 30 seconds — covering everything from executive summary to 90-day launch roadmap.

---

## Features

### Core Platform
- **6-Step Onboarding** — Personal info, employment background, financial capacity, skills, interests, and review
- **6-Factor Match Scoring** — Capital coverage, skill overlap, interest alignment, hours availability, salary replacement potential, and risk level
- **AI Business Plan Generation** — GPT-4o writes an 8-section personalized plan; rule-based fallback if AI is unavailable
- **Real-time Dashboard** — E2B readiness score, capital readiness, plan activity charts (Recharts), and action items

### New Advanced Features
- **Favorites / Bookmarks** — Save any business idea with one click; filter recommendations to favorites only
- **Skill Gap Analysis** — Per-idea breakdown of which required skills you already have vs. need to develop, with curated learning resource links
- **Business Idea Comparison** — Select any two ideas to view a side-by-side comparison table (capital, profit, risk, hours, skills, match score)
- **Launch Milestone Tracker** — 10-step personalized launch checklist on the dashboard, persisted per user with optimistic UI
- **AI Business Name Generator** — GPT-4o generates 5 brandable business name ideas for any chosen idea; click to copy

### Admin Panel (ADMIN role)
- **Platform overview** — Users, ideas, plans, and activity stats
- **Business idea management** — Create, edit, delete, activate/deactivate ideas
- **User management** — Change roles, deactivate/reactivate, permanent delete with confirmation
- **Plan management** — View all plans, hide/restore from users, permanent delete with confirmation
- **Admin seed** — `npm run seed:admin` creates default admin account (configure via `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

### Auth & Security
- JWT-based authentication with token persistence
- bcrypt password hashing (cost factor 12)
- Password reset via email token (nodemailer)
- Rate limiting on auth and password reset routes
- Input validation with `express-validator`
- Ownership checks on all plan and user data

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 19 + Vite | UI framework and build tool |
| React Router DOM | Client-side routing |
| Tailwind CSS | Utility-first styling with custom design system |
| Framer Motion | Animations and transitions |
| Recharts | Dashboard charts |
| @tanstack/react-query | Server state management and caching |
| react-hook-form + Zod | Form handling and validation |
| Axios | HTTP client with interceptors |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express 5 | API server |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| OpenAI SDK (gpt-4o-mini) | AI plan and name generation |
| nodemailer | Password reset emails |
| express-rate-limit | API rate limiting |
| express-validator | Request validation |
| helmet + cors | Security headers |

---

## Project Structure

```
work2business/
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── auth/        # Multi-step registration step components
│   │   │   ├── common/      # PageHeader, EmptyState, Skeleton
│   │   │   ├── dashboard/   # StatCard, AnalyticsChart
│   │   │   ├── landing/     # LandingNavbar, Hero, SocialProof, HowItWorks,
│   │   │   │                #   Features, Testimonials, Pricing, FAQ,
│   │   │   │                #   CTASection, LandingFooter
│   │   │   ├── navigation/  # Sidebar, Topbar
│   │   │   ├── plans/       # PlanCard, PlanSection
│   │   │   ├── recommendations/ # RecommendationCard, RecommendationFilters
│   │   │   └── ui/          # Button, Card, Input, PasswordInput, Stepper
│   │   ├── constants/       # Skills and interests lists
│   │   ├── context/         # AuthContext
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── dashboard/   # Dashboard (with MilestoneTracker)
│   │   │   ├── LandingPage/ # LandingPage (assembles landing components)
│   │   │   ├── plans/       # Plans list, PlanDetails
│   │   │   ├── profile/     # Profile editor with TagSelector
│   │   │   └── recommendations/ # Recommendations with all new features
│   │   └── schemas/         # Zod validation schemas
│   └── vite.config.js       # Vite config with /api proxy to backend
│
└── backend/
    └── src/
        ├── config/          # MongoDB connection
        ├── controllers/     # auth, user, businessIdea, businessPlan, ai
        ├── middlewares/     # auth, role, validation, error
        ├── models/          # User, BusinessIdea, BusinessPlan
        ├── routes/          # auth, user, businessIdeas, recommendations,
        │                    #   businessPlan, ai
        ├── seeds/           # businessSeed.js, userSeed.js (admin)
        ├── services/        # aiService, emailService, recommendationService,
        │                    #   businessPlanService
        ├── utils/           # generateToken
        └── validators/      # authValidator
```

---

## API Reference

### Auth — `/api/v1/auth`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create account (rate limited, validated) |
| POST | `/login` | Sign in, returns JWT + user profile |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password` | Reset password with token |

### User — `/api/v1/user`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/profile` | Get full user profile |
| PUT | `/profile` | Update profile fields |
| GET | `/dashboard-stats` | Aggregated dashboard data |
| GET | `/milestones` | Get launch milestone checklist |
| PATCH | `/milestones/:key/toggle` | Check/uncheck a milestone |

### Business Ideas — `/api/v1/business-ideas`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List all active business ideas |
| GET | `/favorites` | Get user's bookmarked ideas |
| POST | `/:id/favorite` | Toggle bookmark on an idea |
| GET | `/:id/skill-gap` | Skill gap analysis for an idea |
| POST | `/compare` | Compare two ideas side-by-side |

### Recommendations — `/api/v1/recommendations`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get scored + ranked recommendations for current user |

### Business Plans — `/api/v1/business-plans`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List user's business plans |
| GET | `/:id` | Get single plan (ownership checked) |
| DELETE | `/:id` | Delete a plan (ownership checked) |

### AI — `/api/v1/ai`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/business-plan` | Generate AI business plan for an idea |
| POST | `/business-names` | Generate 5 AI business name ideas |

### Admin — `/api/v1/admin` (ADMIN role required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/stats` | Platform overview stats |
| GET | `/users` | List users (search, role filter, pagination) |
| GET | `/users/:id` | User detail with plan counts |
| PATCH | `/users/:id` | Update role or deactivate/reactivate |
| DELETE | `/users/:id?confirm=true` | Permanently delete user and cascade data |
| GET | `/plans` | List all plans across users |
| PATCH | `/plans/:id` | Hide or restore a plan (`isActive`) |
| DELETE | `/plans/:id?confirm=true` | Permanently delete a plan |

Business idea CRUD for admins: `POST/PUT/DELETE /api/v1/business-ideas` (ADMIN only).

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- OpenAI API key (for AI features; rule-based fallback works without it)

### 1. Clone and install

```bash
git clone https://github.com/your-username/work2business.git
cd work2business

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/work2business
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...         # Optional — fallback works without it
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@work2business.com
ADMIN_PASSWORD=Admin@12345   # Change before production
```

### 3. Seed the database

```bash
cd backend
npm run seed          # 15 business ideas
npm run seed:admin    # default admin user
# Or both:
npm run seed:all
```

**Default admin login** (after `npm run seed:admin`):
- Email: `admin@work2business.com` (or `ADMIN_EMAIL` from `.env`)
- Password: `Admin@12345` (or `ADMIN_PASSWORD` from `.env`)

Change `ADMIN_PASSWORD` before deploying to production.

This inserts 15 business ideas across Technology, Education, Finance, Healthcare, Retail, Food & Beverage, Creative, and more.

### 4. Start the servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)
Backend API: [http://localhost:5000](http://localhost:5000)

---

## Data Models

### User
- Personal info (name, email, password hash)
- Employment (profession, employer, monthly salary)
- Financial (available capital, hours per week)
- Skills and interests arrays
- `favoriteIdeas` — array of bookmarked BusinessIdea refs
- `milestones` — embedded 10-step launch checklist
- `profileCompleteness` — virtual computed 0–100 score
- Password reset token fields

### BusinessIdea
- Name, description, category
- `minimumCapital`, `expectedProfit`
- `riskLevel` (LOW / MEDIUM / HIGH)
- `requiredSkills`, `tags`
- `timeToProfit` (months), `hoursRequiredPerWeek`, `successRate`

### BusinessPlan
- Linked to User and BusinessIdea
- `source` (AI / MANUAL)
- 8 sections: executiveSummary, marketAnalysis, businessModel, financialPlan, marketingStrategy, operationalPlan, riskAnalysis, milestones
- `successProbability`, `projectedRevenue`, `projectedProfit`

---

## Scoring Engine

Each business idea is scored 0–100 across 6 dimensions:

| Dimension | Max Points | Logic |
|-----------|-----------|-------|
| Capital Match | 30 | How well user's capital covers the minimum requirement |
| Skill Overlap | 25 | Percentage of required skills the user has |
| Interest Alignment | 20 | Overlap between user interests and idea tags |
| Hours Availability | 10 | Whether user's available hours meet the requirement |
| Salary Replacement | 10 | Expected profit vs. current salary |
| Risk Alignment | 5 | User's risk tolerance vs. idea's risk level |

The total score determines ranking order. The dashboard E2B Readiness score is a weighted average of profile completeness (50%) and top match score (50%).

---

## License

MIT
