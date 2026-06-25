const BusinessIdea = require("../models/BusinessIdea");
const BusinessPlan = require("../models/BusinessPlan");
const User = require("../models/User");
const { generateAIPlan } = require("../services/aiService");
const { generateBusinessPlan } = require("../services/businessPlanService");

exports.generatePlan = async (req, res) => {
  try {
    const { ideaId } = req.body;

    const idea = await BusinessIdea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Business idea not found"
      });
    }

    const user = await User.findById(req.user._id);

    let planData;
    let source = "AI";

    try {
      planData = await generateAIPlan(user, idea);
    } catch (aiError) {
      console.warn("AI generation failed, falling back to rule-based:", aiError.message);
      planData = generateBusinessPlan(user, idea);
      source = "MANUAL";
    }

    const savedPlan = await BusinessPlan.create({
      user: req.user._id,
      businessIdea: idea._id,
      title: planData.title || `${idea.name} — Business Plan`,
      source,
      executiveSummary: planData.executiveSummary,
      marketAnalysis: planData.marketAnalysis,
      businessModel: planData.businessModel,
      financialPlan: planData.financialPlan,
      marketingStrategy: planData.marketingStrategy,
      operationalPlan: planData.operationalPlan,
      riskAnalysis: planData.riskAnalysis,
      initialCapital: user.availableCapital || 0,
      projectedRevenue: planData.projectedRevenue || 0,
      projectedProfit: planData.projectedProfit || 0,
      successProbability: planData.successProbability || 0
    });

    const populated = await savedPlan.populate("businessIdea");

    res.status(201).json({
      success: true,
      data: populated,
      generatedBy: source
    });
  } catch (error) {
    console.error("Generate plan error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
