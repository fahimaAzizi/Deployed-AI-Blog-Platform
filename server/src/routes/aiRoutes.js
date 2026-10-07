const express = require("express");
const OpenAI = require("openai");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/suggest-titles", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Blog content is required.",
      });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful blog writing assistant. Suggest exactly 5 clear, engaging titles for the user's blog content. Return only the titles, one per line, without numbering.",
        },
        {
          role: "user",
          content: `Suggest 5 titles for this blog:\n\n${content}`,
        },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || "";

    const suggestions = text
      .split("\n")
      .map((title) => title.replace(/^[-*\d.)\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 5);

    res.json({
      message: "AI suggestions generated successfully.",
      suggestions,
    });
  } catch (error) {
    console.error("AI error:", error);

    res.status(500).json({
      message: "AI request failed.",
    });
  }
});

module.exports = router;