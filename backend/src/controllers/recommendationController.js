const BusinessIdea = require("../models/BusinessIdea");
const { calculateScore } = require("../services/recommendationService");

exports.getRecommendations = async (req, res) => {
  try {
    const ideas = await BusinessIdea.find();
    const user = req.user; // Assuming user info is attached to the request

    const rankedIdeas = ideas.map((idea) => {
      const score = calculateScore(user, idea);
      let reason = [];

      if (user.availableCapital >= idea.minimumCapital) {
        reason.push("Enough capital available");
      } else {
        reason.push("Capital is lower than expected");
      }

      const matchedSkills = idea.requiredSkills
        .filter(skill => (user.skills || [])
        .map(s => s.toLowerCase())
        .includes(skill.toLowerCase()));

        if(matchedSkills.length > 0) {
            reason.push(`Skill match: ${matchedSkills.join(", ")}`);
        } else {
            reason.push("No strong skill match");
        }

        reason.push(`Risk Level: ${idea.riskLevel}`);

        return {
            id: idea._id,
            name: idea.name,
            category: idea.category,
            minimumCapital: idea.minimumCapital,
            expectedProfit: idea.expectedProfit,
            riskLevel: idea.riskLevel,
            score,
            reason: reason.join(" | ")
        }
    });

    // SORT BY BEST MATCH
    rankedIdeas.sort((a,b) => b.score - a.score);

    res.json({
        success: true,
        count: rankedIdeas.lenght,
        data: rankedIdeas
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: error.message
    });
  }
};
