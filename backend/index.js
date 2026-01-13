const express = require("express");
const cors = require("cors");
const analyzeSEO = require("./seoAnalyzer");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const result = await analyzeSEO(url);
    return res.json(result);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: "Failed to analyze website",
      reason: err.message
    });
  }
}); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});