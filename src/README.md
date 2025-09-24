# Lead Intent Scoring Backend

Backend service to upload an offer, upload leads CSV, score leads using rule-based logic plus AI, and retrieve/export results.

## Setup

1. Requirements: Node.js 18+
2. Install deps:
```bash
npm install
```
3. Create `.env` in project root with:
```bash
OPENAI_API_KEY=your_key_here
PORT=3000
```
4. Start server:
```bash
npm run dev
```

## API

### POST /offer
Body example:
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

### POST /leads/upload
Multipart form with field `file` containing CSV with headers:
`name,role,company,industry,location,linkedin_bio`

### POST /score
Runs scoring on uploaded leads. Returns array with scores.

### GET /results
Returns latest scored leads.

### GET /results/export
Returns CSV of the latest scored results.

## Postman Usage (Step-by-step)
Base URL: `http://localhost:3000`

1) POST /offer
- Method: POST
- URL: http://localhost:3000/offer
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
- Method: POST
- URL: http://localhost:3000/leads/upload
- Body: `form-data`
  - Key: `file` (type: File)
  - Value: select `sample-leads.csv` in the repo
- Note: Do not manually set `Content-Type` — let Postman set `multipart/form-data` automatically.

3) POST /score
- Method: POST
- URL: http://localhost:3000/score
- Body: none

4) GET /results
- Method: GET
- URL: http://localhost:3000/results

5) GET /results/export (CSV)
- Method: GET
- URL: http://localhost:3000/results/export
- In Postman, choose “Send and Download” to save the CSV.

Troubleshooting:
- “Offer or Leads missing”: Run steps 1 and 2 after every server restart.
- CSV error: Ensure `sample-leads.csv` has no extra blank lines. Body type must be `form-data`, key must be exactly `file`.
- AI fallback message shown: Set `OPENAI_API_KEY` in `.env` and restart the server.

## Scoring Logic
- Role relevance: decision maker +20, influencer +10
- Industry match: exact ICP +20, adjacent +10
- Data completeness: all required fields present +10
- AI Layer (OpenAI): High=50, Medium=30, Low=10
- Final Score = rule_score + ai_points

## cURL Examples
```bash
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

# Leads upload
curl -s -X POST http://localhost:3000/leads/upload \
  -F file=@./sample-leads.csv

# Score
curl -s -X POST http://localhost:3000/score

# Results
curl -s http://localhost:3000/results

# Export CSV
curl -sL http://localhost:3000/results/export -o results.csv
```

## Notes
- Keep your OpenAI key private.
- For deployment, you can use Render or Railway. Set env vars there.
- Rule logic implemented in `src/services/scoring.js`; AI prompt in `src/services/aiClient.js`.
- If `OPENAI_API_KEY` is not set, a local heuristic fallback is used for AI intent. 


