const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GENERATE BUSINESS PLAN USING AI

exports.generateAIPlan = async (user, idea) => {
  const prompt = `
You are a senior business consultant.

Generate a detailed business plan for the following:

USER PROFILE:
- Profession: ${user.profession}
- Salary: ${user.monthlySalary}
- Available Capital: ${user.availableCapital}
- Skills: ${(user.skills || []).join(", ")}

BUSINESS IDEA:
- Name: ${idea.name}
- Category: ${idea.category}
- Required Skills: ${idea.requiredSkills.join(", ")}
- Minimum Capital: ${idea.minimumCapital}
- Risk Level: ${idea.riskLevel}

Return ONLY valid JSON in this format:

{
  "executiveSummary": "",
  "marketAnalysis": "",
  "financialPlan": "",
  "marketingStrategy": "",
  "riskAnalysis": "",
  "recommendation": "",
  "successProbability": number
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional business analyst who always returns valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    const content = response.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error("AI Error", error);
    throw new Error("AI Generation Failed");
  }
};
