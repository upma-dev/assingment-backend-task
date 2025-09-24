// POST /offer
// Accepts offer/product context and stores it in memory for scoring.
const express = require("express");
const router = express.Router();
const storage = require("../services/storage");

router.post("/", (req, res) => {
  const data = req.body;
  if (!data.name) return res.status(400).json({ error: "Offer name required" });
  storage.setOffer(data);
  res.json({ message: "Offer saved", offer: data });
});

module.exports = router;
