const User = require("../models/User");
const BusinessPlan = require("../models/BusinessPlan");
const BusinessIdea = require("../models/BusinessIdea");
const { calculateScore } = require("../services/recommendationService");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile"
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "profession",
      "employer",
      "monthlySalary",
      "availableCapital",
      "availableHoursPerWeek",
      "skills",
      "interests"
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total plans count
    const totalPlans = await BusinessPlan.countDocuments({ user: userId });

    // Plans by source
    const plansBySource = await BusinessPlan.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$source", count: { $sum: 1 } } }
    ]);

    const aiPlans = plansBySource.find((p) => p._id === "AI")?.count || 0;
    const manualPlans = plansBySource.find((p) => p._id === "MANUAL")?.count || 0;

    // Monthly plan creation (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyPlans = await BusinessPlan.aggregate([
      { $match: { user: userId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Build a full 6-month array
    const months = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = monthlyPlans.find((m) => m._id.year === year && m._id.month === month);
      months.push({
        month: monthNames[month - 1],
        count: found ? found.count : 0
      });
    }

    // Top recommendation score
    const ideas = await BusinessIdea.find({ isActive: true });
    const user = await User.findById(userId);

    let topScore = 0;
    let topIdea = null;
    let allScores = [];

    ideas.forEach((idea) => {
      const score = calculateScore(user, idea);
      allScores.push({ idea, score });
      if (score > topScore) {
        topScore = score;
        topIdea = idea;
      }
    });

    // E2B Readiness Score: combination of profile completeness + top match score
    const profileScore = user.profileCompleteness || 0;
    const e2bReadiness = Math.round((profileScore * 0.5) + (topScore * 0.5));

    // Capital readiness
    const avgMinCapital =
      ideas.length > 0
        ? Math.round(ideas.reduce((sum, i) => sum + (i.minimumCapital || 0), 0) / ideas.length)
        : 0;

    const capitalReadiness =
      avgMinCapital > 0
        ? Math.min(100, Math.round((user.availableCapital / avgMinCapital) * 100))
        : 0;

    // Category distribution from user's plans
    const planCategories = await BusinessPlan.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "businessideas",
          localField: "businessIdea",
          foreignField: "_id",
          as: "idea"
        }
      },
      { $unwind: { path: "$idea", preserveNullAndEmpty: true } },
      { $group: { _id: "$idea.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPlans,
        aiPlans,
        manualPlans,
        monthlyActivity: months,
        topMatchScore: topScore,
        topIdea: topIdea
          ? { name: topIdea.name, category: topIdea.category, riskLevel: topIdea.riskLevel }
          : null,
        e2bReadiness,
        capitalReadiness,
        profileCompleteness: profileScore,
        availableCapital: user.availableCapital,
        planCategories: planCategories.map((c) => ({
          name: c._id || "Unknown",
          value: c.count
        })),
        totalRecommendations: ideas.length,
        qualifiedRecommendations: allScores.filter((s) => s.score >= 60).length
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};
