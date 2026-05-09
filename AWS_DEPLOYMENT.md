# AWS Deployment Guide (ResumeMaker / open-resume-backup)

This repo is a **Next.js 13 (App Router) frontend** + an **Express/MongoDB backend**. The key to “millisecond page loads” and 24/7 stability is: **never run `next dev` in production**. You **build once** and run the production server.

## 0) What you saw in the logs (and why it was slow)

- `npm start` was running **`next dev`** (development mode).
- In dev mode, Next.js compiles pages on-demand and on file changes; it’s normal to see multi-second compiles.
- For production you want:

```bash
npm run build
npm start
```

That produces precompiled output and removes the “compiling…” delays during normal usage.

---

## 1) Project overview (what you’re deploying)

### Frontend (Next.js)
- Location: repo root (`src/app/...`)
- Port: `3000`
- Build: `npm run build`
- Run: `npm start` (production)
- Docker: root `Dockerfile` builds a **standalone** Next server.

Frontend talks to the backend using `NEXT_PUBLIC_BACKEND_URL` (see `src/app/lib/api.ts`).

### Backend (Express + MongoDB)
- Location: `backend/`
- Port: `3001`
- Run: `backend/server.js`
- Docker: `backend/Dockerfile`
- Database: MongoDB via `MONGODB_URI` (required)

The backend exposes APIs like:
- `GET /api/health`
- `POST /api/ai/site-chat`
- `POST /api/ai/resume-section`
- `GET/POST /api/resumes...`

---

## 2) Local “production” smoke test (before AWS)

### Frontend
```bash
npm install
npm run build
npm start
# http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm start
# http://localhost:3001/api/health
```

### Local env files
Create:
- `.env.local` (frontend) with:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

- `backend/.env` (backend) with at least:

```bash
MONGODB_URI=mongodb+srv://...  # required
JWT_SECRET=change-me           # required for auth routes
CORS_ORIGINS=http://localhost:3000

# AI (required if you want AI routes to work)
OPENROUTER_SITE_API_KEY=...
OPENROUTER_RESUME_API_KEY=...
# optional:
APP_URL=http://localhost:3000
APP_NAME=ResumeMaker
```

You can also use the example templates:
- `.env.local.example` (frontend)
- `backend/.env.example` (backend)

> Important: Any `NEXT_PUBLIC_*` variable is baked into the browser bundle at build time. If you change it, rebuild the frontend.

---

## 3) Recommended AWS setup (fast + 24/7)

### Target architecture
A simple, production-friendly approach is:

- **AWS App Runner**: runs always-on containers for frontend + backend
- **CloudFront** (optional but recommended): single global CDN domain, fast caching for the UI
- **MongoDB Atlas** (recommended) or **Amazon DocumentDB**: managed Mongo-compatible DB

You can run without CloudFront, but CloudFront helps deliver the frontend in milliseconds globally.

---

## 4) Environment variables you must plan for

### Frontend (build-time)
- `NEXT_PUBLIC_BACKEND_URL`
  - Set it to the **public base URL** that should serve `/api/*`.
  - Example (single-domain): `https://resume.example.com`

Because it is `NEXT_PUBLIC_*`, it must be available during **build**.

### Backend (runtime)
Required:
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGINS` (comma-separated list in prod)

AI routes (required for AI features):
- `OPENROUTER_SITE_API_KEY` and/or `OPENAI_API_KEY`
- `OPENROUTER_RESUME_API_KEY` and/or `OPENAI_API_KEY_RECOMMEND`

Optional (but recommended):
- `NODE_ENV=production`
- `APP_URL=https://resume.example.com`
- `APP_NAME=ResumeMaker`
- `RATE_LIMIT_WINDOW_MINUTES`, `RATE_LIMIT_MAX_REQUESTS`, `AI_RATE_LIMIT_MAX`

---

## 5) Container images (build once, deploy many)

### 5.1 Frontend image
The root `Dockerfile` supports build-time injection for `NEXT_PUBLIC_BACKEND_URL`.

```bash
# from repo root
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://resume.example.com \
  -t resumemaker-frontend:latest \
  .
```

### 5.2 Backend image
```bash
# from repo root
docker build -f backend/Dockerfile -t resumemaker-backend:latest .
```

---

## 6) Deploy with AWS App Runner (recommended for simplicity)

### Step A — Create ECR repositories
(One for each image.)

```bash
aws ecr create-repository --repository-name resumemaker-frontend
aws ecr create-repository --repository-name resumemaker-backend
```

### Step A.1 — Keep rollback images (keep newest 2)
You want **rollback safety** (keep the current + previous image), but also want old images cleaned up.

There are two common ways:

1) **ECR lifecycle policy** (recommended): automatically expires old images.
2) **Workflow prune**: deletes old images immediately after a push.

This repo’s GitHub Actions workflow does **both** (policy + immediate prune).

If you want to set the policy manually once, run:

```bash
aws ecr put-lifecycle-policy \
  --repository-name resumemaker-frontend \
  --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 2 images for rollback","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":2},"action":{"type":"expire"}}]}'

aws ecr put-lifecycle-policy \
  --repository-name resumemaker-backend \
  --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 2 images for rollback","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":2},"action":{"type":"expire"}}]}'
```

---

### Step B — Choose how you push images to ECR

You have two options:

#### Option 1 — Manual build + push (one-off)
Use this if you’re testing or doing the first deployment.

##### Step B1 — Login Docker to ECR
```bash
aws ecr get-login-password --region <region> |
  docker login --username AWS --password-stdin <account_id>.dkr.ecr.<region>.amazonaws.com
```

##### Step B2 — Tag + push images
```bash
# Tag
docker tag resumemaker-frontend:latest <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-frontend:latest
docker tag resumemaker-backend:latest  <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-backend:latest

# Push
docker push <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-frontend:latest
docker push <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-backend:latest
```

#### Option 2 — CI/CD with GitHub Actions (recommended)
Use this for “push code → automatically build → push to ECR”.

This repo includes a ready workflow:
- `.github/workflows/ecr-build-push.yml`

What it does on every push to `main`:
- Builds **frontend** image (root `Dockerfile`) and pushes to ECR
- Builds **backend** image (`backend/Dockerfile`) and pushes to ECR
- Tags each image as:
  - `:<git_sha>` (immutable)
  - `:latest` (only on `main`)
- Keeps only the **newest 2 images** in each repo (rollback-safe)
- Uses BuildKit caching so rebuilds are faster after the first run

##### Step B1 — Create AWS auth for GitHub Actions
You have two choices:

1) **OIDC role (recommended)**
   - Create an IAM Role that trusts GitHub’s OIDC provider
   - Grant ECR permissions to that role
   - Store the role ARN in GitHub as a secret: `AWS_ROLE_TO_ASSUME`

2) **Access keys (works, but less secure)**
   - Create an IAM user with ECR permissions
   - Store keys in GitHub secrets: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

At minimum, the principal needs ECR permissions like:
- `ecr:GetAuthorizationToken`
- `ecr:CreateRepository`, `ecr:DescribeRepositories`
- `ecr:PutLifecyclePolicy`
- `ecr:DescribeImages`, `ecr:BatchDeleteImage`
- `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload`
- `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`

##### Step B2 — Set GitHub Variables (non-secret)
GitHub → **Settings → Secrets and variables → Actions → Variables**

- `AWS_REGION`
  - Example: `ap-south-1`
- `ECR_REPOSITORY_FRONTEND`
  - Example: `resumemaker-frontend`
- `ECR_REPOSITORY_BACKEND`
  - Example: `resumemaker-backend`
- `NEXT_PUBLIC_BACKEND_URL`
  - Example (single-domain recommended): `https://resume.example.com`

##### Step B3 — Set GitHub Secrets (secret)
GitHub → **Settings → Secrets and variables → Actions → Secrets**

Recommended:
- `AWS_ROLE_TO_ASSUME` (OIDC role ARN)

OR fallback:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

##### Step B4 — Push to `main`
Once the variables/secrets are set, every push to `main` will:
- Build images
- Push to ECR
- Prune old images (keep last 2)

---

### Step D — Create the backend App Runner service
In the AWS Console → **App Runner**:
- Source: **ECR image** (`resumemaker-backend:latest`)
- Port: `3001`
- Health check path: `/api/health`
- Runtime env vars: set `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`, AI keys
- Scaling: set **min instances = 1** (prevents cold-idle for “24/7”)

> Tip: If you enable **automatic deployments** for the App Runner service, App Runner can redeploy when `:latest` updates.

### Step E — Create the frontend App Runner service
- Source: **ECR image** (`resumemaker-frontend:latest`)
- Port: `3000`
- Health check path: `/`
- Scaling: min instances = 1

> If you’re using separate domains for frontend and backend, set backend `CORS_ORIGINS` to the frontend domain.

---

## 7) (Optional) Put CloudFront in front for single-domain + CDN speed

If you want the cleanest UX (no CORS, one URL) and best caching:

1. Create a CloudFront distribution with **two origins**:
   - Origin #1: frontend App Runner service URL
   - Origin #2: backend App Runner service URL
2. Behaviors:
   - Default (`/*`) → frontend origin
   - `/api/*` → backend origin (disable caching, allow all methods)

Then set:
- `NEXT_PUBLIC_BACKEND_URL=https://<your-cloudfront-or-custom-domain>`

Rebuild + redeploy the frontend image so the browser bundle points to the correct API base.

---

## 8) Performance + 24/7 checklist

- Use **production mode** only: `npm run build` then `npm start` (never `next dev` on AWS).
- Keep at least **1 instance running** (App Runner min instances or ECS desired count).
- Put frontend behind **CloudFront** for global caching and low latency.
- Keep backend in the same AWS region as MongoDB to reduce DB latency.

### Why you saw “slow compilation” (and how this fixes it)
If you see logs like **“Compiling…”** on every request in AWS, it usually means the server is running **Next.js dev mode**.

Fixes:
- Do not run `next dev` in production.
- Use the root `Dockerfile` (it runs `npm run build` and then `node server.js` from Next standalone output).
- Ensure `NEXT_PUBLIC_BACKEND_URL` is set during the Docker build so the client bundle doesn’t point to `localhost`.

Build-time speedups:
- The root `Dockerfile` copies `package.json`/`package-lock.json` before source code so dependency installs are cached.
- The GitHub Actions workflow enables BuildKit layer caching; the **first build is slow**, later builds are much faster.
- Use health checks:
  - Backend: `/api/health`
  - Frontend: `/`
- Turn on logging/metrics:
  - CloudWatch logs for App Runner
  - Alarms for 5xx spikes and latency

---

## 9) Troubleshooting

### “Pages still compile / slow”
- Verify you are **not** running dev:
  - Dev: `npm run dev`
  - Prod: `npm run build` then `npm start`

### “Frontend calls localhost:3001 in production”
- `NEXT_PUBLIC_BACKEND_URL` was not set **during build**.
- Rebuild the frontend container with:
  - `--build-arg NEXT_PUBLIC_BACKEND_URL=...`

### Backend fails to boot
- `MONGODB_URI` is required and validated at startup.
- In production, `CORS_ORIGINS` is required.

---

## 10) Suggested next step

After you choose your AWS region + domain name, decide whether you want:
- **Single domain (recommended)** via CloudFront behaviors (`/api/*` → backend)
- or **two domains** (frontend + backend) with CORS

Once you confirm that, you can lock `NEXT_PUBLIC_BACKEND_URL` and build/push your final images.
