const User = require("../models/User");
const BusinessIdea = require("../models/BusinessIdea");
const BusinessPlan = require("../models/BusinessPlan");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

// GET /admin/stats
exports.getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalUsers,
      activeUsers,
      totalIdeas,
      activeIdeas,
      totalPlans,
      aiPlans,
      manualPlans,
      plansThisMonth,
      hiddenPlans,
      founderUsers,
      recentSignups,
      completedPayments,
      pendingPayments,
      totalRevenueAgg,
      monthlyPlans,
      monthlyUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      BusinessIdea.countDocuments(),
      BusinessIdea.countDocuments({ isActive: true }),
      BusinessPlan.countDocuments(),
      BusinessPlan.countDocuments({ source: "AI" }),
      BusinessPlan.countDocuments({ source: "MANUAL" }),
      BusinessPlan.countDocuments({ createdAt: { $gte: startOfMonth } }),
      BusinessPlan.countDocuments({ isActive: false }),
      User.countDocuments({ "subscription.plan": "founder", "subscription.status": "active" }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Payment.countDocuments({ status: "completed" }),
      Payment.countDocuments({ status: "pending" }),
      Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      BusinessPlan.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
      ])
    ]);

    const monthlyActivity = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const planRow = monthlyPlans.find((m) => m._id.year === year && m._id.month === month);
      const userRow = monthlyUsers.find((m) => m._id.year === year && m._id.month === month);
      monthlyActivity.push({
        month: monthNames[month - 1],
        plans: planRow?.count || 0,
        users: userRow?.count || 0
      });
    }

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const activeRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    const ideaActiveRate = totalIdeas > 0 ? Math.round((activeIdeas / totalIdeas) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalIdeas,
        activeIdeas,
        inactiveIdeas: totalIdeas - activeIdeas,
        totalPlans,
        activePlans: totalPlans - hiddenPlans,
        hiddenPlans,
        aiPlans,
        manualPlans,
        plansThisMonth,
        founderUsers,
        recentSignups,
        completedPayments,
        pendingPayments,
        totalRevenue,
        activeRate,
        ideaActiveRate,
        monthlyActivity
      }
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch platform stats" });
  }
};

// GET /admin/users
exports.getUsers = async (req, res) => {
  try {
    const { search, role, active, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { profession: regex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter)
    ]);

    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const planCount = await BusinessPlan.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          planCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithCounts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// GET /admin/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const planCount = await BusinessPlan.countDocuments({ user: user._id });
    const favoriteIdeasCount = user.favoriteIdeas?.length || 0;
    const favoritePlansCount = user.favoritePlans?.length || 0;

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        planCount,
        favoriteIdeasCount,
        favoritePlansCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// PATCH /admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const targetId = req.params.id;

    if (targetId === req.user._id.toString()) {
      if (isActive === false) {
        return res.status(400).json({ success: false, message: "You cannot deactivate your own account" });
      }
      if (role && role !== "ADMIN") {
        return res.status(400).json({ success: false, message: "You cannot change your own role" });
      }
    }

    const update = {};
    if (role !== undefined) {
      if (!["EMPLOYEE", "MENTOR", "ADMIN"].includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }
      update.role = role;
    }
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    const user = await User.findByIdAndUpdate(targetId, update, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// DELETE /admin/users/:id?confirm=true
exports.deleteUser = async (req, res) => {
  try {
    if (req.query.confirm !== "true") {
      return res.status(400).json({
        success: false,
        message: "Permanent delete requires confirm=true query parameter"
      });
    }

    const targetId = req.params.id;
    if (targetId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account" });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const planIds = await BusinessPlan.find({ user: targetId }).select("_id");
    const planIdList = planIds.map((p) => p._id);

    await Promise.all([
      BusinessPlan.deleteMany({ user: targetId }),
      Notification.deleteMany({ user: targetId }),
      User.updateMany({ favoritePlans: { $in: planIdList } }, { $pull: { favoritePlans: { $in: planIdList } } }),
      user.deleteOne()
    ]);

    res.status(200).json({ success: true, message: "User permanently deleted" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// GET /admin/plans
exports.getPlans = async (req, res) => {
  try {
    const { search, source, active, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (source) filter.source = source;
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    if (search?.trim()) {
      const q = search.trim();
      const [matchingUsers, matchingIdeas] = await Promise.all([
        User.find({
          $or: [
            { email: { $regex: q, $options: "i" } },
            { firstName: { $regex: q, $options: "i" } },
            { lastName: { $regex: q, $options: "i" } }
          ]
        }).select("_id"),
        BusinessIdea.find({ name: { $regex: q, $options: "i" } }).select("_id")
      ]);

      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { user: { $in: matchingUsers.map((u) => u._id) } },
        { businessIdea: { $in: matchingIdeas.map((i) => i._id) } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const numericLimit = Number(limit);

    const [plans, total] = await Promise.all([
      BusinessPlan.find(filter)
        .select("_id title source isActive createdAt user businessIdea")
        .populate("businessIdea", "name")
        .populate("user", "firstName lastName email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      BusinessPlan.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: plans,
      pagination: {
        page: Number(page),
        limit: numericLimit,
        total,
        pages: Math.ceil(total / numericLimit)
      }
    });
  } catch (error) {
    console.error("Admin get plans error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch plans" });
  }
};

// PATCH /admin/plans/:id
exports.updatePlan = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (isActive === undefined) {
      return res.status(400).json({ success: false, message: "isActive is required" });
    }

    const plan = await BusinessPlan.findByIdAndUpdate(
      req.params.id,
      { isActive: Boolean(isActive) },
      { new: true }
    )
      .populate("businessIdea")
      .populate("user", "firstName lastName email");

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update plan" });
  }
};

// DELETE /admin/plans/:id?confirm=true
exports.deletePlan = async (req, res) => {
  try {
    if (req.query.confirm !== "true") {
      return res.status(400).json({
        success: false,
        message: "Permanent delete requires confirm=true query parameter"
      });
    }

    const plan = await BusinessPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    await Promise.all([
      plan.deleteOne(),
      User.updateMany({ favoritePlans: plan._id }, { $pull: { favoritePlans: plan._id } })
    ]);

    res.status(200).json({ success: true, message: "Plan permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete plan" });
  }
};

// GET /admin/ideas/:id
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await BusinessIdea.findById(req.params.id).lean();
    if (!idea) {
      return res.status(404).json({ success: false, message: "Business idea not found" });
    }
    res.status(200).json({ success: true, data: idea });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch business idea" });
  }
};

// GET /admin/plans/:id
exports.getPlanById = async (req, res) => {
  try {
    const plan = await BusinessPlan.findById(req.params.id)
      .populate("businessIdea")
      .populate("user", "firstName lastName email role")
      .lean();

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch plan" });
  }
};

// GET /admin/payments/:id
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "firstName lastName email role subscription")
      .lean();

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    const invoice = await Invoice.findOne({ payment: payment._id })
      .select("_id invoiceNumber issuedAt")
      .lean();

    res.status(200).json({
      success: true,
      data: { ...payment, invoice }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch payment" });
  }
};

// GET /admin/invoices/:id
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("payment", "txRef status amount currency method plan createdAt providerRef metadata")
      .lean();

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch invoice" });
  }
};

// GET /admin/payments
exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      Payment.find()
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Payment.countDocuments()
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
};

// GET /admin/invoices
exports.getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [invoices, total] = await Promise.all([
      Invoice.find()
        .populate("user", "firstName lastName email")
        .sort({ issuedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Invoice.countDocuments()
    ]);

    res.json({
      success: true,
      data: invoices,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch invoices" });
  }
};
