const BusinessPlan = require("../models/BusinessPlan");
const BusinessIdea = require("../models/BusinessIdea");
const { generateBusinessPlan } = require("../services/businessPlanService");

exports.createBusinessPlan = async (req, res) => {
  try {
    const { ideaId } = req.body;

    const idea = await BusinessIdea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Business Idea not found"
      });
    }

    const planData = generateBusinessPlan(req.user, idea);

    const plan = await BusinessPlan.create({
      user: req.user._id,
      businessIdea: idea._id,
      title: `${idea.name} — Business Plan`,
      source: "MANUAL",
      ...planData
    });

    const populated = await plan.populate("businessIdea");

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    console.error("Create plan error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserPlans = async (req, res) => {
  try {
    const plans = await BusinessPlan.find({ user: req.user._id })
      .populate("businessIdea")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await BusinessPlan.findById(req.params.id).populate("businessIdea");

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // Ownership check
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this plan"
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error("Get plan by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await BusinessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // Ownership check
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this plan"
      });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully"
    });
  } catch (error) {
    console.error("Delete plan error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
