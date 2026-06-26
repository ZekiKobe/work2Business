const BusinessIdea = require("../models/BusinessIdea");
const BusinessPlan = require("../models/BusinessPlan");
const User = require("../models/User");
const { generateAIPlan, generateBusinessNames } = require("../services/aiService");
const { generateBusinessPlan } = require("../services/businessPlanService");
const { createNotification } = require("./notificationController");
const { sendPlanGeneratedEmail } = require("../services/emailService");
const { getPlanLimits } = require("../constants/plans");

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
    const limits = getPlanLimits(user.subscription);
    if (limits.aiPlanLimit) {
      const planCount = await BusinessPlan.countDocuments({ user: req.user._id });
      if (planCount >= limits.aiPlanLimit) {
        return res.status(403).json({
          success: false,
          message: "Starter plan includes 1 AI business plan. Upgrade to Founder for unlimited plans.",
          upgradeRequired: true
        });
      }
    }

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
      title: planData.title || `${idea.name} -Business Plan`,
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

    // Trigger notification and email
    await createNotification(
      req.user._id,
      "PLAN_GENERATED",
      "Business Plan Ready",
      `Your ${source === "AI" ? "AI-powered" : ""} business plan for "${idea.name}" has been generated.`,
      `/plans/${savedPlan._id}`
    );

    const fullUser = await User.findById(req.user._id);
    if (fullUser?.preferences?.emailOnPlan) {
      sendPlanGeneratedEmail(fullUser, savedPlan.title, idea.name).catch(() => {});
    }

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

// POST /ai/business-names  { ideaId }
exports.generateNames = async (req, res) => {
  try {
    const { ideaId } = req.body;
    if (!ideaId) {
      return res.status(400).json({ success: false, message: "ideaId is required" });
    }
    const idea = await BusinessIdea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ success: false, message: "Business idea not found" });
    }
    const user = await User.findById(req.user._id);

    const names = await generateBusinessNames(user, idea);

    res.status(200).json({ success: true, names });
  } catch (error) {
    console.error("Generate names error:", error);
    res.status(500).json({ success: false, message: "Failed to generate business names" });
  }
};
