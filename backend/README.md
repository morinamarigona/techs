# TechStore Pro Backend

Node.js + Express + MongoDB backend per TechStore Pro.

## Start

```bash
cd backend
npm install
npm run seed
npm run dev
```

API punon ne `http://localhost:5000/api`.

## Hostim falas + mos e lë backend-in të flejë

Ne Render **free tier**, serveri fle pas **15 minuta** pa trafik. Kur fle, herën e parë duhen **30–90 sekonda** për të u zgjuar — prandaj aplikacioni “Duke u ngarkuar”.

**Kur serveri fle, vetë backend-i nuk mund ta ping-ojë veten.** Duhet ping **i jashtëm** çdo 10–14 minuta.

### 1. GitHub Actions (rekomandohet — tashmë në projekt)

1. Hosto backend-in dhe merr URL-në publike, p.sh. `https://techstorepro-api.onrender.com`
2. Ne GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Emri: `BACKEND_URL`
   - Vlera: `https://techstorepro-api.onrender.com` (**pa** `/api/health`)
3. Workflow-i `.github/workflows/keep-alive.yml` ping-on `/api/health` **çdo 10 minuta** (me retry për cold start).

Test manual: **Actions → Keep Backend Alive → Run workflow**.

> **Kërkohet:** repo në GitHub dhe secret `BACKEND_URL` i vendosur. Pa secret, workflow-i nuk bën asgjë.

### 2. cron-job.org (backup — nëse GitHub Actions nuk mjafton)

1. Regjistrohu në [cron-job.org](https://cron-job.org) (falas)
2. Krijo cronjob:
   - **URL:** `https://your-api.onrender.com/api/health`
   - **Schedule:** çdo **14 minuta** (`*/14 * * * *`)
3. Aktivizo cronjob-in

### 3. Self-ping në backend (shtesë — kur serveri është aktiv)

Kur backend-i është zgjuar, `startKeepAlive()` ping-on veten çdo 14 minuta (ndihmon midis ping-ave të jashtëm).

Në Render, `RENDER_EXTERNAL_URL` vendoset automatikisht. Opsionale në `.env`:

```env
KEEP_ALIVE_URL=https://your-api.onrender.com
KEEP_ALIVE_INTERVAL_MINUTES=14
KEEP_ALIVE_ENABLED=true
```

### Health endpoint

`GET /api/health` — përdoret nga cron-et e jashtëm dhe self-ping.

## Auth endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/resend-verification`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## Demo users pas seed

- `menaxher@techstore.al` / `123456`
- `punetor1@techstore.al` / `123456`
- `punetor2@techstore.al` / `123456`
