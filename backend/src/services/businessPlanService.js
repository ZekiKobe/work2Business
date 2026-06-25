const generateBusinessPlan = (user, idea) => {
  const capital = user.availableCapital || 0;
  const projectedRevenue = (idea.expectedProfit || 0) * 1.8;
  const projectedProfit = idea.expectedProfit || 0;
  const monthlyProfit = Math.round(projectedProfit / 12);
  const monthlyRevenue = Math.round(projectedRevenue / 12);
  const category = idea.category || "General Business";

  const executiveSummary = `${idea.name} is a ${category.toLowerCase()} business opportunity with ${idea.riskLevel?.toLowerCase() || "moderate"} risk and strong growth potential. As a ${user.profession || "professional"}, your background provides direct applicability to this venture. The business requires ${idea.minimumCapital?.toLocaleString() || "N/A"} ETB in startup capital, and with ${capital.toLocaleString()} ETB available, ${capital >= (idea.minimumCapital || 0) ? "you are fully capitalized to launch" : "you may want to explore phased entry or bridge funding"}. Expected time to first profit is ${idea.timeToProfit || 6} months, with an annual profit target of ${projectedProfit.toLocaleString()} ETB.`;

  const marketAnalysis = `The ${category} sector is experiencing consistent growth driven by digital adoption and shifting consumer preferences. ${idea.name} addresses a real market need with a growing customer base in both urban and suburban areas. Competition exists at the entry level but quality execution and personal branding can create meaningful differentiation. Key customer segments include small businesses, professionals, and digitally active consumers who value quality and reliability. Market entry barriers are low to moderate, making this an accessible opportunity for a first-time entrepreneur with your skill set.`;

  const businessModel = `Revenue will be generated through service delivery or product sales in the ${category} space. A tiered pricing model — starter, standard, and premium — allows you to serve different customer segments while maximizing lifetime value. Initial pricing should be competitive to build a portfolio, with 20-30% increases as reputation grows. Recurring revenue through retainers or subscription packages should be the mid-term goal to ensure cash flow stability.`;

  const financialPlan = {
    startupCosts: `Initial investment of ${(idea.minimumCapital || 0).toLocaleString()} ETB covering equipment, licensing, initial marketing, and 3-month operating reserves.`,
    monthlyExpenses: `Estimated monthly operating costs of ${Math.round((idea.minimumCapital || 0) * 0.08).toLocaleString()} ETB including utilities, subscriptions, and variable costs.`,
    revenueProjection: `Month 1: ${Math.round(monthlyRevenue * 0.2).toLocaleString()} ETB | Month 3: ${Math.round(monthlyRevenue * 0.5).toLocaleString()} ETB | Month 6: ${Math.round(monthlyRevenue * 0.8).toLocaleString()} ETB | Year 1: ${projectedRevenue.toLocaleString()} ETB`,
    breakEvenPoint: `Estimated break-even at month ${idea.timeToProfit || 6} assuming consistent customer acquisition of 2-4 new clients per month.`,
    fundingStrategy: capital >= (idea.minimumCapital || 0)
      ? "You have sufficient capital. Consider keeping 20% as an emergency reserve."
      : `Capital gap of ${((idea.minimumCapital || 0) - capital).toLocaleString()} ETB. Options: personal savings, microfinance, or phased launch starting with lower-cost service offerings.`
  };

  const marketingStrategy = `Build your initial client base through personal network activation — reach out to 50 contacts in your first week. Establish a professional LinkedIn and social media presence with consistent content about your expertise. Create a simple portfolio website or landing page within 30 days. Leverage referral incentives to convert your first 5 customers into advocates. Allocate 15% of early revenue to paid social advertising once you have proof of concept and clear messaging.`;

  const operationalPlan = `Week 1-2: Register business, open bank account, set up digital presence. Week 3-4: Build service offerings and pricing menu, create initial marketing materials. Month 2: Launch outreach campaign, conduct first paid engagements, collect testimonials. Month 3: Systemize delivery, hire first part-time help if needed, reinvest 30% of profits. Month 4-6: Scale marketing, optimize pricing, pursue repeat business and referrals.`;

  const riskAnalysis = {
    topRisks: [
      "Slow customer acquisition — Mitigate with aggressive networking and referral programs in first 90 days",
      "Capital depletion before profitability — Maintain 3-month expense reserve, track burn weekly",
      "Skill gaps in business operations — Invest in a business fundamentals course in month 1"
    ],
    marketRisks: "Market competition may increase as the sector grows. Stay ahead through specialization and exceptional service quality.",
    operationalRisks: "Managing client delivery alongside business development is the core early challenge. Time-box both activities weekly.",
    financialRisks: "Irregular income in early months. Maintain salary income during initial phase if possible to reduce financial pressure."
  };

  return {
    title: `${idea.name} — Business Plan`,
    executiveSummary,
    marketAnalysis,
    businessModel,
    financialPlan,
    marketingStrategy,
    operationalPlan,
    riskAnalysis,
    initialCapital: capital,
    projectedRevenue,
    projectedProfit,
    successProbability: capital >= (idea.minimumCapital || 0) ? 72 : 55
  };
};

module.exports = { generateBusinessPlan };
