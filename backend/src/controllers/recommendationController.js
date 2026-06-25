const BusinessIdea = require("../models/BusinessIdea");
const User = require("../models/User");
const { calculateScore, generateMatchReasons } = require("../services/recommendationService");

exports.getRecommendations = async (req, res) => {
  try {
    const ideas = await BusinessIdea.find({ isActive: true });
    const user = await User.findById(req.user._id);

    const ranked = ideas.map((idea) => {
      const { score, breakdown } = calculateScore(user, idea);
      const reasons = generateMatchReasons(user, idea, breakdown);

      return {
        id: idea._id,
        name: idea.name,
        description: idea.description,
        category: idea.category,
        minimumCapital: idea.minimumCapital,
        expectedProfit: idea.expectedProfit,
        riskLevel: idea.riskLevel,
        requiredSkills: idea.requiredSkills,
        tags: idea.tags,
        timeToProfit: idea.timeToProfit,
        hoursRequiredPerWeek: idea.hoursRequiredPerWeek,
        successRate: idea.successRate,
        score,
        breakdown,
        reasons
      };
    });

    ranked.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      count: ranked.length,
      data: ranked
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
