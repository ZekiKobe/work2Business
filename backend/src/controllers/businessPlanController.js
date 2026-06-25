const BusinessPlan = require("../models/BusinessPlan");
const BusinessIdea = require("../models/BusinessIdea");
const User = require("../models/User");
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
    const user = await User.findById(req.user._id).select("favoritePlans");
    const favoriteIds = new Set((user?.favoritePlans || []).map((id) => id.toString()));

    const plans = await BusinessPlan.find({ user: req.user._id, isActive: { $ne: false } })
      .populate("businessIdea")
      .sort({ createdAt: -1 });

    const data = plans.map((plan) => ({
      ...plan.toObject(),
      isFavorited: favoriteIds.has(plan._id.toString())
    }));

    res.json({
      success: true,
      count: data.length,
      data
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

    // Ownership check (admins can view any plan)
    const isOwner = plan.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this plan"
      });
    }

    if (!isAdmin && plan.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const user = await User.findById(req.user._id).select("favoritePlans");
    const isFavorited = isOwner && (user?.favoritePlans || []).some(
      (id) => id.toString() === plan._id.toString()
    );

    res.json({
      success: true,
      data: { ...plan.toObject(), isFavorited }
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
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favoritePlans: plan._id }
    });

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

exports.getFavoritePlans = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favoritePlans",
      populate: { path: "businessIdea" }
    });

    const plans = (user?.favoritePlans || [])
      .filter((plan) => plan != null && plan.isActive !== false)
      .map((plan) => ({
      ...plan.toObject(),
      isFavorited: true
    }));

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error("Get favorite plans error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const plan = await BusinessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user.favoritePlans) user.favoritePlans = [];
    const planId = plan._id;
    const idx = user.favoritePlans.findIndex((id) => id.toString() === planId.toString());
    let isFavorited;

    if (idx === -1) {
      user.favoritePlans.push(planId);
      isFavorited = true;
    } else {
      user.favoritePlans.splice(idx, 1);
      isFavorited = false;
    }

    await user.save();

    res.status(200).json({
      success: true,
      isFavorited,
      favoriteCount: user.favoritePlans.length
    });
  } catch (error) {
    console.error("Toggle favorite plan error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
