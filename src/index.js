// App entrypoint
// - Loads env (.env)
// - Sets up JSON parsing and routes
// - Starts HTTP server
require("dotenv").config();
const express = require("express");
const app = express();
const offerRoutes = require("./routes/offer");
const leadsRoutes = require("./routes/leads");
const scoreRoutes = require("./routes/score");
const resultsRoutes = require("./routes/results");

app.use(express.json());

// routes
app.use("/offer", offerRoutes);
app.use("/leads", leadsRoutes);
app.use("/score", scoreRoutes);
app.use("/results", resultsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
