# Lead Intent Scoring Backend (Node.js)

Backend service to accept an Offer, upload Leads CSV, score leads via rule logic + AI, and return/export results.

## Deployment
Live API: [https://assingment-backend-task.vercel.app](https://assingment-backend-task.vercel.app)

## Tech Stack
- Node.js + Express
- OpenAI (optional; local heuristic fallback included)
- Multer + csv-parse
- Jest (rule layer tests)
- Dockerfile + Render config

## Quick Start
1) Requirements: Node 18+
2) Install
```
npm install
```
3) Env (create `.env` in project root)
```
OPENAI_API_KEY=your_key_here   # optional; fallback used if missing
PORT=3000                      # optional; defaults to 3000
```
4) Run
```
npm run dev
```
Server: http://localhost:3000

## API Endpoints
- POST `/offer` → save product/offer context
- POST `/leads/upload` → upload CSV (multipart/form-data, key: `file`)
- POST `/score` → run rule + AI scoring
- GET `/results` → scored leads (JSON)
- GET `/results/export` → scored leads (CSV download)

## Postman (Recommended Flow)
Base URL: `http://localhost:3000`

1) POST /offer
- Headers: `Content-Type: application/json`
- Body (raw → JSON):
```json
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"],
  "decision_roles": ["Head of Growth", "VP Sales", "Founder"],
  "influencer_roles": ["Growth Manager", "Sales Ops"],
  "icp_industries": ["SaaS", "Software"]
}
```

2) POST /leads/upload
- Body: `form-data`
  - Key: `file` (type: File)
  - Value: select `sample-leads.csv`
- Note: Don’t set `Content-Type` manually; Postman sets multipart boundary.

3) POST /score (no body)

4) GET /results

5) GET /results/export → Send and Download to save CSV

Troubleshooting:
- “Offer or Leads missing”: Re-run steps 1 and 2 after every server restart (in-memory store).
- CSV error: Ensure no extra blank lines and correct commas. Key must be exactly `file`.
- AI fallback message: Set `OPENAI_API_KEY` and restart server.

## cURL Quickstart
```
# Offer
curl -s -X POST http://localhost:3000/offer \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"AI Outreach Automation",
    "value_props":["24/7 outreach","6x more meetings"],
    "ideal_use_cases":["B2B SaaS mid-market"],
    "decision_roles":["Head of Growth","VP Sales","Founder"],
    "influencer_roles":["Growth Manager","Sales Ops"],
    "icp_industries":["SaaS","Software"]
  }'

# Leads
curl -s -X POST http://localhost:3000/leads/upload -F file=@./sample-leads.csv

# Score
curl -s -X POST http://localhost:3000/score

# Results
curl -s http://localhost:3000/results

# Export
curl -sL http://localhost:3000/results/export -o results.csv
```

## Scoring Logic
- Rule Layer (max 50)
  - Role relevance: decision maker (+20), influencer (+10)
  - Industry match: exact ICP (+20), adjacent use-case token overlap (+10)
  - Data completeness: all fields present (+10)
- AI Layer (max 50)
  - Model classifies High/Medium/Low + brief reason
  - Map: High=50, Medium=30, Low=10
- Final = rule_score + ai_points
- Fallback: if `OPENAI_API_KEY` absent, uses heuristic intent for demo

## Tests
```
npm test
```

## Deploy
- Render (recommended)
  - Build: `npm install`
  - Start: `npm start`
  - Env vars: `OPENAI_API_KEY` (optional), `PORT` (or platform default)
- Docker: `Dockerfile` included

### Live URL
Add your production URL here after deploy:
```
LIVE_BASE_URL=https://<your-app>.onrender.com
```

## Files of Interest
- `src/index.js` – app init and routes
- `src/routes/*` – API endpoints (offer, leads, score, results)
- `src/services/scoring.js` – rule logic
- `src/services/aiClient.js` – OpenAI client + fallback
- `src/utils/csv.js` – CSV builder
- `tests/ruleScore.test.js` – rule layer tests

## Demo (Loom)
Link: <add your 2–3 min walkthrough link here>