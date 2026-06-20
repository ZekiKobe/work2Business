const generateBusinessPlan = (user, idea) => {
  const capital = user.availableCapital || 0;

  // BASIC FINANCIAL MODEL
  const projectedRevenue = idea.expectedProfit * 2;
  const projectedProfit = idea.expectedProfit;

  // EXECUTIVE SUMMARY
  const executiveSummary = `
${idea.name} is a business opportunity in the ${idea.category} sector.
It requires a startup capital of ${idea.minimumCapital} ETB.
The business is suitable for professionals with skills in ${idea.requiredSkills.join(", ")}.
The user has ${capital} ETB available capital.
`;

  // MARKET ANALYSIS
  const marketAnalysis = `
The ${idea.category} sector is growing in urban areas.
Demand for ${idea.name} services is increasing due to digital transformation.
Competition exists but is still moderate in emerging markets.
`;

  // FINANCIAL PLAN
  const financialPlan = `
Initial Investment: ${idea.minimumCapital} ETB
Expected Monthly Revenue: ${projectedRevenue / 12} ETB
Expected Annual Profit: ${projectedProfit} ETB
Break-even estimated within 6–12 months depending on execution.
`;

  // MARKETING STRATEGY
  const marketingStrategy = `
Use social media marketing (Facebook, Telegram, TikTok).
Leverage personal network and referrals.
Offer initial discounted services to acquire first customers.
`;

  // RISK ANALYSIS
  const riskAnalysis = `
Risk Level: ${idea.riskLevel}
Main risks include market competition, lack of customers, and capital shortage.
Mitigation: start small, validate market demand before scaling.
`;

  return {
    executiveSummary,
    marketAnalysis,
    financialPlan,
    marketingStrategy,
    riskAnalysis,
    initialCapital: capital,
    projectedRevenue,
    projectedProfit,
  };
};

module.exports = {
  generateBusinessPlan,
};
