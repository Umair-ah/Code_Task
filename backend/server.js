const express = require("express");
const cors = require("cors");
require("dotenv").config();
const codeTypeRoutes = require("./routes/codeTypeRoutes");
const codeDataRoutes = require("./routes/codeDataRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/code_types", codeTypeRoutes);
app.use("/api/code_data", codeDataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
