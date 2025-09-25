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

  // Use local heuristic if OpenAI client is not initialized
  if (!openai) {
    return useLocalHeuristic(lead, "OpenAI API key not configured");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    });

    let result;
    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      return { intent: "Medium", explanation: "AI response parsing failed, using fallback scoring" };
    }
    return result;
  } catch (error) {
    console.log(`OpenAI API Error: ${error.message}`);
    
    // Handle specific error cases
    let reason = "service unavailable";
    if (error.message.includes("429") || error.message.includes("quota")) {
      reason = "service temporarily unavailable";
    } else if (error.message.includes("401") || error.message.includes("authentication")) {
      reason = "authentication issue";
    } else if (error.message.includes("500") || error.message.includes("503")) {
      reason = "service error";
    }
    
    // Fall back to local heuristic
    return useLocalHeuristic(lead, reason);
  }
}

// Helper function for local heuristic scoring
function useLocalHeuristic(lead, reason) {
  const text = `${lead.role || ''} ${lead.industry || ''} ${lead.linkedin_bio || ''}`.toLowerCase();
  let intent = "Low";
  
  if (/head|vp|director|founder|chief|lead/.test(text)) intent = "Medium";
  if (/head of growth|vp sales|c(oo|eo|ro)|founder/.test(text)) intent = "High";
  
  return { 
    intent, 
    explanation: `Using local heuristic scoring (${reason}). Based on role and industry keywords.` 
  };
}

module.exports = { classifyIntent };
