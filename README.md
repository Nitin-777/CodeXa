

  
██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗ █████╗
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝██╔══██╗
 ██║     ██║   ██║██║  ██║█████╗   ╚███╔╝ ███████║
 ██║     ██║   ██║██║  ██║██╔══╝   ██╔██╗ ██╔══██║
 ╚██████╗╚██████╔╝██████╔╝███████╗██╔╝ ██╗██║  ██║
  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝



  

  Smart Coding Contest Platform
Real-time code execution · AI-powered hints · Live leaderboards · Plagiarism detection
<br/>
Show Image
Show Image
Show Image
Show Image
Show Image
Show Image
Show Image
<br/>
Features · Tech Stack · Getting Started · Project Structure · API Reference · Roadmap
</div>

✨ Features
FeatureDescription⚡ Real-time Code ExecutionRun code in 20+ languages via Judge0, with live verdict streaming over WebSockets🏆 Live LeaderboardsICPC-style scoring with Redis sorted sets and instant Socket.io push updates🎯 Contest HostingFull contest lifecycle management — create, schedule, register, compete🤖 AI Hint SystemProgressive 3-level hints powered by Claude — direction only, then pseudocode, then skeleton🔍 Plagiarism DetectionAST fingerprinting + MOSS integration with a side-by-side admin diff dashboard🔐 Production AuthJWT access tokens (15m) + rotating refresh tokens (7d) in httpOnly cookies🛡️ Security HardenedHelmet.js, CORS whitelist, rate limiting, NoSQL injection prevention, input sanitization

🧰 Tech Stack
┌─────────────────────────────────────────────────────────┐
│                       FRONTEND                          │
│   React 18 · TypeScript · Tailwind CSS · Vite           │
│   Monaco Editor · Socket.io-client · React Hook Form    │
├─────────────────────────────────────────────────────────┤
│                       BACKEND                           │
│   Node.js · Express · TypeScript                        │
│   Socket.io · Bull (job queues) · Winston               │
├─────────────────────────────────────────────────────────┤
│                      DATABASES                          │
│   MongoDB + Mongoose  ·  Redis (Upstash-compatible)     │
├─────────────────────────────────────────────────────────┤
│                     INTEGRATIONS                        │
│   Judge0 CE (code execution)  ·  Anthropic Claude API   │
│   MOSS (plagiarism)  ·  tree-sitter (AST analysis)      │
├─────────────────────────────────────────────────────────┤
│                       DEVOPS                            │
│   Docker Compose  ·  GitHub Actions CI/CD               │
│   Railway / Render  ·  Vercel  ·  MongoDB Atlas         │
└─────────────────────────────────────────────────────────┘

🚀 Getting Started
Prerequisites

Node.js ≥ 20
MongoDB (local or Atlas)
Redis (local or Upstash)
Judge0 (Docker self-hosted or RapidAPI)

1 · Clone & Install
bashgit clone https://github.com/yourname/codexa.git
cd codexa
npm install          # installs all workspaces (server, client, shared)
2 · Configure Environment
bashcp .env.example server/.env
Open server/.env and fill in your values:
env# Required
MONGODB_URI=mongodb://localhost:27017/codexa
JWT_ACCESS_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_REFRESH_SECRET=<generate: same command>

# Optional — app works without these but features degrade gracefully
REDIS_URL=redis://localhost:6379
JUDGE0_URL=http://localhost:2358
ANTHROPIC_API_KEY=sk-ant-...
3 · Start Development
bash# Run both server and client concurrently
npm run dev

# Or individually
npm run dev --workspace=server   # http://localhost:5000
npm run dev --workspace=client   # http://localhost:5173
4 · Seed Sample Data (optional)
bashcd server
npx ts-node scripts/seedProblems.ts
5 · Run Tests
bashnpm run test --workspace=server

🐳 Docker Compose (recommended for local full-stack)
bashcp .env.example .env   # edit with your secrets
docker compose up -d
This starts: API server · React client (nginx) · MongoDB · Redis · Judge0 worker
http://localhost:5173   →  Codexa UI
http://localhost:5000   →  REST API
http://localhost:2358   →  Judge0 API

📁 Project Structure
codexa/
├── shared/                     # @codexa/shared — types used by both server & client
│   └── src/types/
│       └── auth.ts             # RegisterRequest, LoginRequest, PublicUser, JwtPayload
│
├── server/                     # @codexa/server — Express API
│   └── src/
│       ├── config/
│       │   ├── env.ts          # Zod-validated env vars (fails fast on startup)
│       │   ├── database.ts     # Mongoose connect with retry
│       │   ├── redis.ts        # ioredis wrapper with graceful fallback
│       │   ├── tokens.ts       # JWT sign/verify, bcrypt, cookie options
│       │   └── logger.ts       # Winston structured logging
│       ├── middleware/
│       │   ├── auth.ts         # verifyToken, optionalAuth, requireAdmin
│       │   ├── rateLimiter.ts  # api / auth / submission limiters
│       │   └── errorHandler.ts # Zod, Mongoose, AppError unified handler
│       ├── models/
│       │   ├── User.ts         # User schema + comparePassword + toPublicJSON
│       │   ├── Contest.ts      # (Day 2)
│       │   ├── Problem.ts      # (Day 2)
│       │   └── Submission.ts   # (Day 3)
│       ├── routes/
│       │   ├── auth.ts         # /register /login /refresh /logout /me
│       │   ├── contests.ts     # (Day 2)
│       │   └── hints.ts        # (Day 5)
│       ├── workers/
│       │   └── judge.worker.ts # (Day 3) Bull queue → Judge0 → Socket.io
│       ├── sockets/
│       │   └── contest.socket.ts # (Day 4) Leaderboard real-time
│       ├── app.ts              # Express setup, middleware, routes
│       └── index.ts            # Server bootstrap + graceful shutdown
│
└── client/                     # @codexa/client — React SPA
    └── src/
        ├── lib/
        │   └── axios.ts        # Axios instance + token refresh interceptor
        ├── context/
        │   └── AuthContext.tsx # Auth state, login/register/logout, session restore
        ├── hooks/
        │   ├── useAuth.ts      # Convenience re-export
        │   ├── useSubmission.ts # (Day 3)
        │   └── useLeaderboard.ts # (Day 4)
        ├── components/
        │   ├── ProtectedRoute.tsx
        │   ├── CodeEditor.tsx  # (Day 3) Monaco wrapper
        │   └── ScoreRow.tsx    # (Day 4)
        └── pages/
            ├── Login.tsx
            ├── Register.tsx
            ├── Dashboard.tsx
            ├── ContestList.tsx # (Day 2)
            └── ContestDetail.tsx # (Day 2+)

🔌 API Reference
Auth
MethodEndpointAuthDescriptionPOST/api/auth/register—Create account, returns access tokenPOST/api/auth/login—Login, sets httpOnly refresh cookiePOST/api/auth/refreshCookieRotate tokens silentlyPOST/api/auth/logoutBearerInvalidate refresh tokenGET/api/auth/meBearerGet current userGET/api/health—Server health check
Contests (Day 2)
MethodEndpointAuthDescriptionGET/api/contestsOptionalList with filters: status, page, limitPOST/api/contestsAdminCreate contestGET/api/contests/:idOptionalContest detail + problemsPOST/api/contests/:id/registerBearerRegister as participantGET/api/contests/:id/leaderboardBearerLive leaderboard
Submissions (Day 3)
MethodEndpointAuthDescriptionPOST/api/submissionsBearerSubmit code (queued)GET/api/submissions/:idBearerPoll verdictGET/api/submissions/meBearerMy submission history
Hints (Day 5)
MethodEndpointAuthDescriptionPOST/api/hintsBearerGet AI hint (level 1–3)

🔐 Security Model
Client                    Server                      DB / Cache
  │                          │                              │
  │─── POST /login ─────────▶│                              │
  │                    validate (Zod)                        │
  │                    bcrypt.compare (12 rounds)            │
  │                    generate accessToken (15m JWT)        │
  │                    generate refreshToken (7d JWT)        │
  │                    hash(refreshToken) ──────────────────▶│ MongoDB
  │◀── accessToken (body) ───│                              │
  │◀── refreshToken (httpOnly SameSite=Strict cookie) ──────│
  │                          │                              │
  │─── API request ─────────▶│ verifyToken middleware        │
  │   Authorization: Bearer  │ check user.isActive ────────▶│
  │◀── 200 ─────────────────▶│                              │
  │                          │                              │
  │─── 401 (token expired) ──│                              │
  │─── POST /refresh ───────▶│ verify cookie JWT            │
  │                          │ compare hash(incomingToken)──▶│
  │                          │ rotate both tokens           │
  │◀── new accessToken ──────│                              │
Key security decisions:

Refresh tokens are stored as SHA-256 hashes — the raw token is never persisted
Token reuse detection: on mismatch, all sessions are invalidated immediately
Passwords use bcrypt with cost factor 12
Auth routes have a separate stricter rate limiter (10 req / 15 min, failed requests only)
express-validator + Zod dual validation — schema on input, type-safe on handler


📅 7-Day Build Plan
DayFocusStatusDay 1Project setup, monorepo, JWT auth, User model✅ CompleteDay 2Contest engine, Problem bank, CRUD APIs🔲Day 3Monaco editor, Judge0 integration, real-time verdict🔲Day 4Live leaderboard with Redis sorted sets + Socket.io🔲Day 5AI hint system (Claude API) with progressive levels🔲Day 6Plagiarism detection (MOSS + AST fingerprinting)🔲Day 7Security hardening, Docker Compose, CI/CD deploy🔲

🌍 Deployment
Recommended Stack (free tiers available)
ServiceProviderNotesAPI + WorkerRailwayAuto-deploy from GitHubFrontendVercelVITE_API_URL env varMongoDBMongoDB AtlasM0 free tierRedisUpstashServerless, per-request billingJudge0Self-hosted on RailwayOr RapidAPI for low traffic
Environment Variables for Production
envNODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...
JWT_ACCESS_SECRET=<64-byte hex>
JWT_REFRESH_SECRET=<64-byte hex>
CLIENT_URL=https://your-app.vercel.app
JUDGE0_URL=https://your-judge0.railway.app
ANTHROPIC_API_KEY=sk-ant-...

🤝 Contributing
bash# 1. Fork and clone
git clone https://github.com/yourname/codexa.git

# 2. Create a feature branch
git checkout -b feat/your-feature

# 3. Make changes, add tests
npm run test --workspace=server

# 4. Open a PR against main
Please follow the existing code style (ESLint + Prettier configured) and write tests for new API routes.

📄 License
MIT © 2025 Codexa Contributors
