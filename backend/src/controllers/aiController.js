const BusinessIdea = require("../models/BusinessIdea");
const BusinessPlan = require("../models/BusinessPlan");
const { generateAIPlan } = require("../services/aiService");

// BUSINESS PLAN GENERATOR

exports.generatePlan = async (req, res) => {
  try {
    const { ideaId } = req.body;

    const idea = await BusinessIdea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({
        sucess: false,
        message: "Business idea not found",
      });
    }

    const aiPlan = await generateAIPlan(req.user, idea);

    const savedPlan = await BusinessPlan.create({
      user: req.user._id,
      businessIdea: idea._id,
      executiveSummary: aiPlan.executiveSummary,
      marketAnalysis: aiPlan.marketAnalysis,
      financialPlan: aiPlan.financialPlan,
      marketingStrategy: aiPlan.marketingStrategy,
      riskAnalysis: aiPlan.riskAnalysis,
      projectedProfit: aiPlan.successProbability || 0,
    });

    res.status(201).json({
        sucess: true,
        data: savedPlan
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
        sucess: false,
        message: error.message
    })
  }
};
