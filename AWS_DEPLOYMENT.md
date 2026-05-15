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

### Why we’re not using EKS here (and why ECR still matters)
- **ECR** is only a *container registry* (where images live). You can use ECR with **App Runner**, **ECS**, or **EKS**.
- **EKS** is Kubernetes. It’s powerful, but it adds extra operational work (cluster lifecycle, networking/ingress, upgrades, observability, RBAC, etc.).
- For this repo (2 services: frontend + backend), **App Runner** is usually the simplest “24/7” solution:
  - Always-on with **min instances = 1**
  - Simple health checks and logging
  - Easy container redeploys from ECR

When EKS *does* make sense:
- You already run Kubernetes for other services
- You need advanced traffic routing, service mesh, custom autoscaling, or many microservices

If you choose EKS later:
- Keep the same CI step (build + push images to ECR)
- Add a deploy step (Helm/kubectl) to update Kubernetes manifests to the new image tag

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

### Why there is a Dockerfile in the repo root (and where docker-compose fits)
- A **Dockerfile** builds **one** container image.
  - Root `Dockerfile` = **frontend** image (Next.js standalone server)
  - `backend/Dockerfile` = **backend** image (Express API)
- `docker-compose.yml` (if you add one) is just an **orchestrator** to run multiple containers together.
  - It still needs Dockerfiles (to build) or prebuilt images (to pull).
  - AWS services like **App Runner** don’t use docker-compose; they deploy containers from ECR directly.

---

## 6) Deploy options on AWS

If you don’t see **App Runner** in the AWS Console, it’s usually because:
- Your current AWS **region doesn’t support it**, or
- You prefer to stay inside the **free-tier EC2** style setup.

Below are two practical deployment options that work well with ECR images.

### Option A — AWS App Runner (simplest if available)

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

##### (Optional) Smoke test the containers on the build machine (e.g., EC2)
After you build both images in section **5)**, you can run them to verify the containers boot.

Backend (requires env vars):

```bash
docker run --rm \
  --name resumemaker-backend \
  -p 3001:3001 \
  --env-file backend/.env \
  resumemaker-backend:latest
```

Frontend (no runtime env needed — `NEXT_PUBLIC_*` is baked in at build time):

```bash
docker run --rm \
  --name resumemaker-frontend \
  -p 3000:3000 \
  resumemaker-frontend:latest
```

Important:
- For an EC2 test, `NEXT_PUBLIC_BACKEND_URL` must be reachable from your browser (don’t use `http://localhost:3001` unless you’re testing locally on your own machine).
- For the smoke test you can set `NEXT_PUBLIC_BACKEND_URL` to `http://<EC2_PUBLIC_IP>:3001` while building the frontend.
- For the real production build, rebuild the frontend image with the final domain (CloudFront/custom domain).

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

What it does on every push to `main`/`master`:
- Builds **frontend** image (root `Dockerfile`) and pushes to ECR
- Builds **backend** image (`backend/Dockerfile`) and pushes to ECR
- Tags each image as:
  - `:<git_sha>` (immutable)
  - `:latest` (only on `main`/`master`)
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

###### OIDC (recommended) — how to get `AWS_ROLE_TO_ASSUME`
AWS Console steps:

1) IAM → **Identity providers** → **Add provider** → OpenID Connect
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
2) IAM → **Roles** → **Create role** → Web identity
   - Choose the GitHub OIDC provider
3) Add a trust policy condition to restrict usage to your repo + branch.
   Example trust policy (replace placeholders):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_OWNER>/<GITHUB_REPO>:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

4) Attach permissions (policy example below)
5) Copy the role ARN (looks like `arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME>`) and paste into GitHub Secret: `AWS_ROLE_TO_ASSUME`

###### Access keys (fallback) — how to get `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
AWS Console steps:

1) IAM → **Users** → **Create user**
2) Attach the ECR permissions policy
3) Open the user → **Security credentials** → **Create access key**
4) Copy the values into GitHub Secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

At minimum, the principal needs ECR permissions like:
- `ecr:GetAuthorizationToken`
- `ecr:CreateRepository`, `ecr:DescribeRepositories`
- `ecr:PutLifecyclePolicy`
- `ecr:DescribeImages`, `ecr:BatchDeleteImage`
- `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload`
- `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`

Example IAM permissions policy you can attach to the role/user (broad but practical):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:CreateRepository",
        "ecr:DescribeRepositories",
        "ecr:PutLifecyclePolicy",
        "ecr:DescribeImages",
        "ecr:BatchDeleteImage",
        "ecr:BatchCheckLayerAvailability",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "*"
    }
  ]
}
```

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

Important:
- For this workflow, you **do not need** to add your app runtime secrets (like `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `OPENROUTER_*`) to GitHub.
- Those belong in the **runtime environment** of your backend container (App Runner/ECS), or in **AWS Secrets Manager/SSM Parameter Store**.
- The only app-related value the workflow needs is `NEXT_PUBLIC_BACKEND_URL`, and that should be a **GitHub Variable** (not a secret) because it is baked into the frontend bundle at build time.

##### Step B4 — Push to `main`/`master`
Once the variables/secrets are set, every push to `main`/`master` will:
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

### Option C — AWS ECS (Fargate or ECS on EC2)

Yes, you can absolutely run these ECR images on **ECS**.

When to choose ECS:
- You want a managed scheduler (restarts containers, health checks, logs)
- You don’t want to hand-manage `docker run` on a server

Cost note:
- **Fargate** is easiest but typically **not free-tier**.
- **ECS on EC2** can be “free-tier friendly” if you run on a small EC2 instance, but you still manage the EC2 host.

Recommended ECS architecture for this repo:
- 1 **Application Load Balancer (ALB)**
- 2 **Target Groups**:
  - `frontend-tg` → container port `3000`
  - `backend-tg` → container port `3001`
- ALB Listener rules:
  - `/api/*` → `backend-tg`
  - `/*` → `frontend-tg`

High-level steps:

1) Create an ECS cluster
  - Choose **Fargate** (simpler) or **EC2** capacity (cheaper sometimes)

2) Create task definitions (one for frontend, one for backend)
  - Images: from your ECR repos
  - Frontend container port: `3000`
  - Backend container port: `3001`
  - Backend env vars: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`, optional AI keys

3) Create an ALB + listener + target groups
  - Backend health check path: `/api/health`
  - Frontend health check path: `/`

4) Create ECS services
  - Desired count: `1` (24×7)
  - Attach each service to its target group

5) Important: how ECS picks up NEW images
  - ECS does **not** automatically redeploy when you push a new image to ECR.
  - You must trigger a deploy by either:
    - updating the task definition to the new image tag (recommended: use `:<git_sha>`), then updating the service, OR
    - forcing a new deployment (works best if you configure your cluster to always pull fresh images)

If you want “push to GitHub → build/push to ECR → auto deploy to ECS”, tell me whether you’ll use:
- **Fargate** or **ECS on EC2**, and your planned `ECS_CLUSTER` + service names.
Then I can extend the GitHub Actions workflow to update the ECS services automatically.

---

### Option B — EC2 + Docker (free-tier friendly, works in any region)

This option runs both containers on a single EC2 instance. It’s simple and works even when App Runner is unavailable.

#### Step 1 — Launch an EC2 instance
- Ubuntu 22.04 LTS (recommended)
- Instance type:
  - Build/test: `t3.small` or bigger is smoother
  - Runtime: `t3.micro` might work, but if you see OOM/restarts, move to `t3.small`
- Security group inbound (minimum):
  - SSH `22` from your IP
  - HTTP `80` from anywhere
  - HTTPS `443` from anywhere
  - (Temporary testing only) `3000` and `3001` from your IP

#### Step 2 — Allow EC2 to pull from ECR (recommended way)
Attach an **IAM Role** to the EC2 instance with:
- `AmazonEC2ContainerRegistryReadOnly`

This avoids storing AWS keys on the server.

#### Step 3 — Install Docker + AWS CLI on EC2

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin awscli
sudo usermod -aG docker ubuntu
newgrp docker
```

#### Step 4 — Login to ECR from EC2

```bash
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin <account_id>.dkr.ecr.<region>.amazonaws.com
```

#### Step 5 — Create backend runtime env file on EC2
Create a file like `~/resumemaker-backend.env` (do NOT commit it) with:
- `NODE_ENV=production`
- `MONGODB_URI=...`
- `CORS_ORIGINS=https://<your-frontend-domain>`
- `JWT_SECRET=...`
- (Optional) AI keys

#### Step 6 — Run the backend container (24×7)

```bash
docker pull <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-backend:latest

docker run -d \
  --name resumemaker-backend \
  --restart unless-stopped \
  -p 127.0.0.1:3001:3001 \
  --env-file ~/resumemaker-backend.env \
  <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-backend:latest
```

#### Step 7 — Run the frontend container (24×7)

```bash
docker pull <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-frontend:latest

docker run -d \
  --name resumemaker-frontend \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-frontend:latest
```

#### Step 8 — Put a single domain in front (recommended)
Install nginx on EC2 and reverse-proxy:
- `/api/*` → backend `http://127.0.0.1:3001`
- everything else → frontend `http://127.0.0.1:3000`

This gives a clean single URL and avoids exposing ports `3000/3001` publicly.

1) Install nginx:

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

2) Create an nginx site config (replace `your-domain.com`):

```bash
sudo tee /etc/nginx/sites-available/resumemaker >/dev/null <<'EOF'
server {
  listen 80;
  server_name your-domain.com;

  # API to backend
  location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Everything else to frontend
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF
```

3) Enable the site and reload nginx:

```bash
sudo ln -sf /etc/nginx/sites-available/resumemaker /etc/nginx/sites-enabled/resumemaker
sudo nginx -t
sudo systemctl reload nginx
```

4) Point your domain DNS A-record to the EC2 public IP.

5) Enable HTTPS with Let’s Encrypt:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Step 9 — Updating to the newest image
ECR push does **not** automatically restart containers on EC2. To deploy the newest images:

```bash
docker pull <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-backend:latest
docker pull <account_id>.dkr.ecr.<region>.amazonaws.com/resumemaker-frontend:latest

docker rm -f resumemaker-backend resumemaker-frontend

# re-run the same docker run commands from Step 6 and Step 7
```

If you want, we can also add a GitHub Actions “deploy” step (SSH or SSM) to run the above automatically after each push.

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
