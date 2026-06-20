exports.calculateScore = (user, idea) => {
  let score = 0;

  // 1. CAPITAL MATCH
  if (user.availableCapital >= idea.minimumCapital) {
    score += 40;
  } else{
    // Penality if not enough capital
    const gap = idea.minimumCapital - user.availableCapital;
    score -= Math.min(30, gap/1000);
  }

  // 2. SKILL MATCHING

  const userSkills = user.skills || [];
  const requiredSkills = idea.requiredSkills || [];

  const matchedSkills = requiredSkills.filter(skill => userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase()));

  const skillScore = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 40 : 0;
  score += skillScore;

  // 3. SALARY STABILITY FACTOR
  if(user.monthlySalary > 0) {
    if(user.monthlySalary > 10000) score += 10;
    else score += 5;
  }

  // 4. RISK ALIGNMENT
  if(idea.riskLevel === 'LOW') score += 15;
  else if(idea.riskLevel === 'MEDIUM') score += 8;
  else score += 3;

  // 5. FINAL NORMALIZATION
  if(score < 0) score = 0;
  if(score > 100) score = 100;

  return Math.round(score);
};
