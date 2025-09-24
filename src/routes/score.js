// Scoring endpoints
// - POST /score: runs rule + AI scoring on uploaded leads
// - GET /results/export: downloads scored results as CSV
const express = require("express");
const router = express.Router();
const storage = require("../services/storage");
const { ruleScore } = require("../services/scoring");
const { classifyIntent } = require("../services/aiClient");
const { toCsv } = require("../utils/csv");

router.post("/", async (req, res) => {
  const offer = storage.getOffer();
  const leads = storage.getLeads();
  if (!offer || leads.length === 0) {
    return res.status(400).json({ error: "Offer or Leads missing" });
  }

  const results = await Promise.all(leads.map(async (lead) => {
    const rScore = ruleScore(lead, offer);
    const aiResult = await classifyIntent(offer, lead);
    const aiPoints = aiResult.intent === "High" ? 50 :
                     aiResult.intent === "Medium" ? 30 : 10;
    const final = rScore + aiPoints;
    return {
      ...lead,
      rule_score: rScore,
      ai_points: aiPoints,
      score: final,
      intent: aiResult.intent,
      reasoning: aiResult.explanation
    };
  }));

  storage.updateLeads(results);
  res.json(results);
});

router.get("/results/export", (req, res) => {
  const data = storage.getLeads();
  if (!data || data.length === 0) {
    return res.status(400).json({ error: "No results to export" });
  }

  const headers = [
    "name",
    "role",
    "company",
    "industry",
    "location",
    "linkedin_bio",
    "rule_score",
    "ai_points",
    "score",
    "intent",
    "reasoning"
  ];

  const csv = toCsv(data, headers);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=results.csv");
  res.send(csv);
});

module.exports = router;
