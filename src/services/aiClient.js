// AI client wrapper
// - Uses OpenAI when OPENAI_API_KEY is present
// - Falls back to a local heuristic for offline demos
const OpenAI = require("openai");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

async function classifyIntent(offer, lead) {
  const prompt = `
You are a sales-intent classifier.
Given the product/offer and a single prospect, classify the prospect's buying intent as High, Medium, or Low and explain in 1–2 sentences.

Product/Offer:
${JSON.stringify(offer)}

Prospect:
${JSON.stringify(lead)}

Return JSON ONLY:
{
  "intent": "High|Medium|Low",
  "explanation": "short explanation"
}
  `;

  if (!openai) {
    // Fallback heuristic if API key is missing
    const text = `${lead.role || ''} ${lead.industry || ''} ${lead.linkedin_bio || ''}`.toLowerCase();
    let intent = "Low";
    if (/head|vp|director|founder|chief|lead/.test(text)) intent = "Medium";
    if (/head of growth|vp sales|c(oo|eo|ro)|founder/.test(text)) intent = "High";
    return { intent, explanation: "Local heuristic fallback without AI key" };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150
  });

  let result;
  try {
    result = JSON.parse(response.choices[0].message.content);
  } catch (e) {
    result = { intent: "Low", explanation: "Parsing failed" };
  }
  return result;
}

module.exports = { classifyIntent };
