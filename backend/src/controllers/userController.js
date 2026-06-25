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

const DEFAULT_MILESTONES = [
  { key: "complete_profile", title: "Complete your profile", description: "Fill in all profile fields including skills, interests, and capital.", order: 1 },
  { key: "explore_recommendations", title: "Explore business matches", description: "View your AI-matched business recommendations and review your top score.", order: 2 },
  { key: "bookmark_idea", title: "Bookmark a business idea", description: "Save at least one business idea to your favorites.", order: 3 },
  { key: "analyze_skill_gap", title: "Analyze your skill gap", description: "Check the skill gap analysis for your top-matched business idea.", order: 4 },
  { key: "compare_ideas", title: "Compare two ideas", description: "Use the comparison tool to decide between two business ideas.", order: 5 },
  { key: "generate_ai_plan", title: "Generate an AI business plan", description: "Create your first AI-powered business plan with GPT-4o.", order: 6 },
  { key: "generate_business_names", title: "Generate business names", description: "Use the AI name generator to get brand ideas for your chosen business.", order: 7 },
  { key: "review_plan", title: "Review your full plan", description: "Read through all 8 sections of your generated business plan.", order: 8 },
  { key: "refine_plan", title: "Generate a second plan", description: "Iterate — create a second plan for a different idea or improved profile.", order: 9 },
  { key: "ready_to_launch", title: "Declare launch readiness", description: "Mark yourself as ready to begin the real-world steps of launching.", order: 10 }
];

exports.getMilestones = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Initialize milestones if empty
    if (!user.milestones || user.milestones.length === 0) {
      user.milestones = DEFAULT_MILESTONES.map(m => ({ ...m, completed: false }));
      await user.save();
    }

    const completed = user.milestones.filter(m => m.completed).length;
    const total = user.milestones.length;

    res.status(200).json({
      success: true,
      milestones: user.milestones,
      completedCount: completed,
      totalCount: total,
      progressPercent: Math.round((completed / total) * 100)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch milestones" });
  }
};

exports.toggleMilestone = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { key } = req.params;

    const milestone = user.milestones.find(m => m.key === key);
    if (!milestone) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }

    milestone.completed = !milestone.completed;
    milestone.completedAt = milestone.completed ? new Date() : undefined;
    await user.save();

    res.status(200).json({
      success: true,
      milestone,
      completedCount: user.milestones.filter(m => m.completed).length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle milestone" });
  }
};
