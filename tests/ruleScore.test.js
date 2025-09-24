const { ruleScore } = require('../src/services/scoring');

describe('ruleScore', () => {
  const baseOffer = {
    decision_roles: ['Head of Growth', 'VP Sales', 'Founder'],
    influencer_roles: ['Growth Manager', 'Sales Ops'],
    icp_industries: ['SaaS', 'Software'],
    ideal_use_cases: ['B2B SaaS mid-market']
  };

  test('awards 20 for decision maker role', () => {
    const lead = { role: 'Head of Growth' };
    expect(ruleScore(lead, baseOffer)).toBe(20);
  });

  test('awards 10 for influencer role', () => {
    const lead = { role: 'Growth Manager' };
    expect(ruleScore(lead, baseOffer)).toBe(10);
  });

  test('awards 20 for exact industry match', () => {
    const lead = { role: 'Analyst', industry: 'SaaS' };
    expect(ruleScore(lead, baseOffer)).toBe(20);
  });

  test('awards 10 for adjacent (use-case) industry keyword', () => {
    const lead = { role: 'Analyst', industry: 'Mid-market Retail' };
    // industry contains 'mid-market' word from ideal_use_cases first token
    expect(ruleScore(lead, baseOffer)).toBe(10);
  });

  test('awards 10 for data completeness', () => {
    const lead = {
      name: 'A', role: 'B', company: 'C', industry: 'D', location: 'E', linkedin_bio: 'F'
    };
    // completeness only = 10
    expect(ruleScore(lead, baseOffer)).toBe(10);
  });

  test('combines all to max 50', () => {
    const lead = {
      name: 'Ava', role: 'Head of Growth', company: 'Flow', industry: 'SaaS', location: 'SF', linkedin_bio: 'bio'
    };
    // decision 20 + industry 20 + completeness 10 = 50
    expect(ruleScore(lead, baseOffer)).toBe(50);
  });
});


