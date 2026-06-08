# Deploy `/swarm` to Vercel

The **Python swarm cannot run on Vercel** (serverless, no long-lived processes). Architecture:

```
Your PC (WSL)                    Vercel
python3 agents/swarm_api.py  →   POST /api/swarm/ingest  →  Upstash Redis (KV)
     every ~6s                         ↑
                                  GET /api/swarm/state
                                  GET /api/fhe/state
                                       ↓
                              https://YOUR_APP.vercel.app/swarm
```

---

## 1. Deploy Next.js (one time)

```powershell
cd c:\Users\dell\cursor-symbio\Symbiomarket\arc-nanopayments
npm install
npx vercel login
npx vercel link
npx vercel --prod
```

**Production URL:** https://arc-nanopayments-dun.vercel.app/swarm

---

## 2. Add Redis on Vercel (required for live data)

1. Vercel project → **Storage** → **Create Database** → **Upstash Redis** (or Marketplace → Upstash).
2. Connect to this project — Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`.

---

## 3. Set Vercel environment variables

| Variable | Value |
|----------|--------|
| `SWARM_INGEST_SECRET` | Long random string (e.g. `openssl rand -hex 32`) |
| `KV_REST_API_URL` | Auto from Redis integration |
| `KV_REST_API_TOKEN` | Auto from Redis integration |

Redeploy after adding env vars: `npx vercel --prod`.

---

## 4. Local `.env` (repo root) — push to Vercel

```env
SWARM_INGEST_URL=https://YOUR_APP.vercel.app/api/swarm/ingest
SWARM_INGEST_SECRET=same-secret-as-vercel
```

---

## 5. Run swarm (streams to Vercel)

```bash
# WSL
cd /mnt/c/Users/dell/cursor-symbio/Symbiomarket
source venv/bin/activate
python3 agents/swarm_api.py
```

You should see: `[ok] Cycle N -> swarm updated + pushed to Vercel`

After FHE/Arc sync, push FHE state too:

```powershell
python agents/push_swarm_state.py
```

---

## 6. Verify

- https://YOUR_APP.vercel.app/swarm — live cycles updating
- https://YOUR_APP.vercel.app/api/swarm/meta — `{ "source": "kv", "ingestEnabled": true }`

---

## Local dev (unchanged)

Without `SWARM_INGEST_*`, `swarm_api.py` only writes `swarm_data.json`; Next.js reads local files when KV is not set.

---

## README

Add deployed URL under **Live App** in root `README.md` after first deploy.
