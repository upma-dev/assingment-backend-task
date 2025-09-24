// POST /leads/upload
// Receives CSV (multipart/form-data: key "file"), parses, and stores leads.
// Tolerant to empty lines and minor column mismatches.
const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse");
const fs = require("fs");
const storage = require("../services/storage");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "CSV file required" });

  const leads = [];
  fs.createReadStream(req.file.path)
    .pipe(parse({ columns: true, trim: true, skip_empty_lines: true, relax_column_count: true }))
    .on("data", (row) => leads.push(row))
    .on("end", () => {
      storage.addLeads(leads);
      fs.unlinkSync(req.file.path); // delete temp file
      res.json({ message: "Leads uploaded", count: leads.length });
    })
    .on("error", (err) => {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
      res.status(400).json({ error: "Invalid CSV format", details: String(err) });
    });
});

module.exports = router;
