// GET /results
// Returns the latest scored leads from in-memory storage.
const express = require("express");
const router = express.Router();
const storage = require("../services/storage");
const { toCsv } = require("../utils/csv");

router.get("/", (req, res) => {
  res.json(storage.getLeads());
});

router.get("/export", (req, res) => {
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


