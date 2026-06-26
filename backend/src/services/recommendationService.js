/**
 * Advanced multi-dimensional scoring engine.
 * Returns a 0–100 score + a breakdown object for transparency.
 */
exports.calculateScore = (user, idea) => {
  const breakdown = {};

  // ── 1. CAPITAL MATCH (max 30 pts) ────────────────────────────────────────
  let capitalScore = 0;
  const minCap = idea.minimumCapital || 0;
  const userCap = user.availableCapital || 0;

  if (minCap === 0) {
    capitalScore = 25; // No capital required is a bonus
  } else if (userCap >= minCap) {
    // Reward having extra buffer (up to 30)
    const ratio = userCap / minCap;
    capitalScore = Math.min(30, 20 + Math.floor((ratio - 1) * 5));
  } else {
    // Penalize proportionally but gently
    const coverage = userCap / minCap;
    capitalScore = Math.round(coverage * 15); // max 14 if almost there
  }
  breakdown.capital = Math.max(0, capitalScore);

  // ── 2. SKILL MATCHING (max 25 pts) ───────────────────────────────────────
  const userSkills = (user.skills || []).map((s) => s.toLowerCase());
  const requiredSkills = (idea.requiredSkills || []).map((s) => s.toLowerCase());

  let skillScore = 0;
  if (requiredSkills.length > 0) {
    const matched = requiredSkills.filter((s) => userSkills.includes(s));
    skillScore = Math.round((matched.length / requiredSkills.length) * 25);
  }
  breakdown.skills = skillScore;

  // ── 3. INTEREST & CATEGORY ALIGNMENT (max 20 pts) ────────────────────────
  const userInterests = (user.interests || []).map((i) => i.toLowerCase());
  const ideaTags = (idea.tags || []).map((t) => t.toLowerCase());
  const ideaCategory = (idea.category || "").toLowerCase();

  let interestScore = 0;
  // Direct category match = big bonus
  if (userInterests.includes(ideaCategory)) interestScore += 12;
  // Tag overlap
  const tagMatches = ideaTags.filter((t) => userInterests.includes(t));
  interestScore += Math.min(8, tagMatches.length * 4);
  breakdown.interest = Math.min(20, interestScore);

  // ── 4. HOURS AVAILABILITY (max 10 pts) ───────────────────────────────────
  const userHours = user.availableHoursPerWeek || 0;
  const requiredHours = idea.hoursRequiredPerWeek || 20;

  let hoursScore = 0;
  if (userHours >= requiredHours) {
    hoursScore = 10;
  } else if (userHours > 0) {
    hoursScore = Math.round((userHours / requiredHours) * 10);
  }
  breakdown.hours = hoursScore;

  // ── 5. SALARY REPLACEMENT POTENTIAL (max 10 pts) ─────────────────────────
  const salary = user.monthlySalary || 0;
  const expectedMonthlyProfit = (idea.expectedProfit || 0) / 12;

  let salaryScore = 0;
  if (salary === 0) {
    salaryScore = 5; // Neutral
  } else {
    const replaceRatio = expectedMonthlyProfit / salary;
    if (replaceRatio >= 1.5) salaryScore = 10;
    else if (replaceRatio >= 1.0) salaryScore = 8;
    else if (replaceRatio >= 0.7) salaryScore = 6;
    else if (replaceRatio >= 0.4) salaryScore = 4;
    else salaryScore = 2;
  }
  breakdown.salaryReplacement = salaryScore;

  // ── 6. RISK ALIGNMENT BONUS (max 5 pts) ──────────────────────────────────
  // Lower risk = safer baseline score (not penalizing high-risk)
  let riskScore = 0;
  if (idea.riskLevel === "LOW") riskScore = 5;
  else if (idea.riskLevel === "MEDIUM") riskScore = 3;
  else riskScore = 1;
  breakdown.risk = riskScore;

  // ── TOTAL ─────────────────────────────────────────────────────────────────
  const raw =
    breakdown.capital +
    breakdown.skills +
    breakdown.interest +
    breakdown.hours +
    breakdown.salaryReplacement +
    breakdown.risk;

  const score = Math.min(100, Math.max(0, Math.round(raw)));

  return { score, breakdown };
};

/**
 * Generate human-readable match reasons from a breakdown object.
 */
exports.generateMatchReasons = (user, idea, breakdown) => {
  const reasons = [];

  if (breakdown.capital >= 20) reasons.push("Strong capital match");
  else if (breakdown.capital >= 10) reasons.push("Partial capital match");
  else reasons.push("Capital shortfall -consider starting small");

  const userSkillsLower = (user.skills || []).map((s) => s.toLowerCase());
  const matched = (idea.requiredSkills || []).filter((s) =>
    userSkillsLower.includes(s.toLowerCase())
  );
  if (matched.length > 0) reasons.push(`Skills aligned: ${matched.slice(0, 3).join(", ")}`);
  else reasons.push("Consider upskilling in: " + (idea.requiredSkills || []).slice(0, 2).join(", "));

  if (breakdown.interest >= 10) reasons.push("High interest alignment");
  if (breakdown.hours >= 8) reasons.push("Time availability is sufficient");
  if (breakdown.salaryReplacement >= 8) reasons.push("Strong salary replacement potential");

  return reasons;
};
