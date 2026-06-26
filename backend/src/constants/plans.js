exports.PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 0,
    currency: "ETB",
    period: "forever",
    aiPlanLimit: 1,
    bookmarkLimit: 3
  },
  founder: {
    id: "founder",
    name: "Founder",
    price: 2500,
    currency: "ETB",
    period: "year",
    aiPlanLimit: null,
    bookmarkLimit: null
  }
};

exports.isSubscriptionExpired = (subscription = {}) => {
  if (!subscription.expiresAt) return false;
  return new Date(subscription.expiresAt) < new Date();
};

exports.getPlanLimits = (subscription = {}) => {
  const planId = subscription.plan || "starter";
  const isActiveFounder =
    planId === "founder" &&
    subscription.status === "active" &&
    !exports.isSubscriptionExpired(subscription);
  return isActiveFounder ? exports.PLANS.founder : exports.PLANS.starter;
};

exports.syncSubscriptionStatus = async (user) => {
  if (!user?.subscription) return user;

  const sub = user.subscription;
  const expired = exports.isSubscriptionExpired(sub);

  if (sub.plan === "founder" && sub.status === "active" && expired) {
    sub.plan = "starter";
    sub.status = "expired";
    sub.cancelAtPeriodEnd = false;
    sub.paymentMethod = undefined;
    await user.save();
  }

  return user;
};

exports.buildSubscriptionResponse = (user) => {
  const sub = user.subscription || { plan: "starter", status: "active" };
  const limits = exports.getPlanLimits(sub);
  let daysRemaining = null;

  if (sub.expiresAt && sub.status === "active" && sub.plan === "founder") {
    const diff = new Date(sub.expiresAt) - new Date();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return {
    ...sub.toObject?.() ?? sub,
    daysRemaining,
    limits: {
      aiPlanLimit: limits.aiPlanLimit,
      bookmarkLimit: limits.bookmarkLimit,
      planName: limits.name
    }
  };
};
