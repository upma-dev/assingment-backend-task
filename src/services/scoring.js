/**
 * Compute rule-based score for a lead against the given offer.
 * Max 50 points: role (20/10), industry (20/10), completeness (10).
 */
function ruleScore(lead, offer) {
    let score = 0;
  
    // Role relevance
    const role = (lead.role || "").toLowerCase();
    if (offer?.decision_roles?.some(r => role.includes(r.toLowerCase()))) {
      score += 20;
    } else if (offer?.influencer_roles?.some(r => role.includes(r.toLowerCase()))) {
      score += 10;
    }
  
  // Industry match
  const industry = (lead.industry || "").toLowerCase();
  if (offer?.icp_industries?.map(i => i.toLowerCase()).includes(industry)) {
    score += 20;
  } else if (offer?.ideal_use_cases && offer.ideal_use_cases.length > 0) {
    const tokenize = (text) => text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(t => t && t.length >= 3);
    const industryTokens = new Set(tokenize(industry));
    const hasOverlap = offer.ideal_use_cases.some(useCase => {
      const ucTokens = tokenize(useCase);
      return ucTokens.some(t => industryTokens.has(t));
    });
    if (hasOverlap) score += 10;
  }
  
    // Completeness
    const required = ["name", "role", "company", "industry", "location", "linkedin_bio"];
    if (required.every(f => lead[f] && lead[f].trim() !== "")) score += 10;
  
    return score;
  }
  
  module.exports = { ruleScore };
  