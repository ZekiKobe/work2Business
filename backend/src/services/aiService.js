const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateAIPlan = async (user, idea) => {
  const monthlyProfit = Math.round((idea.expectedProfit || 0) / 12);
  const capitalBuffer = user.availableCapital > (idea.minimumCapital || 0)
    ? `has ${user.availableCapital - idea.minimumCapital} extra buffer`
    : `is short by ${(idea.minimumCapital || 0) - user.availableCapital}`;

  const prompt = `
You are a senior business consultant helping an employee transition to entrepreneurship.

USER PROFILE:
- Name: ${user.firstName} ${user.lastName}
- Current Profession: ${user.profession || "Not specified"}
- Monthly Salary: ${user.monthlySalary || 0} ETB
- Available Capital: ${user.availableCapital || 0} ETB (${capitalBuffer} vs required)
- Available Hours/Week: ${user.availableHoursPerWeek || 0} hours
- Skills: ${(user.skills || []).join(", ") || "Not specified"}
- Interests: ${(user.interests || []).join(", ") || "Not specified"}

BUSINESS IDEA:
- Name: ${idea.name}
- Category: ${idea.category}
- Description: ${idea.description}
- Required Skills: ${(idea.requiredSkills || []).join(", ")}
- Minimum Capital: ${idea.minimumCapital || 0} ETB
- Expected Annual Profit: ${idea.expectedProfit || 0} ETB (~${monthlyProfit} ETB/month)
- Risk Level: ${idea.riskLevel}
- Time to Profit: ${idea.timeToProfit || 6} months
- Hours Required/Week: ${idea.hoursRequiredPerWeek || 20}

Generate a comprehensive, actionable business plan. Return ONLY valid JSON with no markdown:

{
  "title": "Specific descriptive title for this plan",
  "executiveSummary": "2-3 paragraphs. Vision, why this works for this specific person, key success factors.",
  "marketAnalysis": "2-3 paragraphs. Target market size, customer segments, competitor landscape, market trends.",
  "businessModel": "1-2 paragraphs. Revenue model, pricing strategy, delivery mechanism.",
  "financialPlan": {
    "startupCosts": "Breakdown of initial investment items",
    "monthlyExpenses": "Recurring cost breakdown",
    "revenueProjection": "Month 1, Month 3, Month 6, Year 1, Year 2 projections with reasoning",
    "breakEvenPoint": "Expected break-even timeline and calculation",
    "fundingStrategy": "How to fund any capital gap if present"
  },
  "marketingStrategy": "2 paragraphs. Channels, messaging, first 90-day customer acquisition plan.",
  "operationalPlan": "Step-by-step 90-day launch roadmap with specific weekly milestones.",
  "riskAnalysis": {
    "topRisks": ["List of 3-4 key risks with mitigation strategies"],
    "marketRisks": "External market risks",
    "operationalRisks": "Internal execution risks",
    "financialRisks": "Financial and cash flow risks"
  },
  "successProbability": <number 0-100 based on profile fit>,
  "keyMilestones": ["30-day milestone", "60-day milestone", "90-day milestone", "6-month milestone", "1-year milestone"],
  "recommendation": "Final 1-paragraph personalized recommendation for this specific user."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional business consultant. You return ONLY valid JSON, no markdown, no explanation text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 2500
    });

    const content = response.choices[0].message.content.trim();
    
    // Strip markdown code fences if present
    const cleaned = content.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    
    return JSON.parse(cleaned);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("AI returned invalid JSON:", error.message);
      throw new Error("AI returned malformed response. Please try again.");
    }
    console.error("AI service error:", error);
    throw new Error("AI generation failed. Please try again or use manual plan.");
  }
};

exports.generateBusinessNames = async (user, idea) => {
  const prompt = `You are a creative branding expert. Generate exactly 5 unique, memorable, and professional business name ideas for a new business with the following details:

Business Type: ${idea.name}
Category: ${idea.category}
Owner Background: ${user.profession || "Professional"} with ${(user.skills || []).slice(0, 3).join(", ")} skills
Target Market: ${(idea.tags || []).join(", ") || "General"}

Rules:
- Each name should be short (1-3 words max), memorable, and easy to spell
- Mix styles: some may be descriptive, some abstract, some founder-inspired
- Avoid generic words like "Solutions", "Services", "Group" unless creatively used
- Return ONLY a valid JSON array of 5 strings, no extra text

Example output: ["BridgePoint", "ClearPath Consulting", "NovaEdge", "Nexgen Hub", "PeakWork"]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 200
    });

    const content = response.choices[0].message.content.trim();
    const cleaned = content.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const names = JSON.parse(cleaned);

    if (!Array.isArray(names)) throw new Error("Expected array");
    return names.slice(0, 5);
  } catch (error) {
    // Fallback names if AI fails
    const prefix = idea.name.split(" ")[0];
    return [
      `${prefix}Pro`,
      `${prefix} Hub`,
      `${prefix}Edge`,
      `Smart${prefix}`,
      `${prefix} Ventures`
    ];
  }
};
