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

exports.getPlanLimits = (subscription = {}) => {
  const planId = subscription.plan || "starter";
  const isActiveFounder =
    planId === "founder" && subscription.status === "active";
  return isActiveFounder ? exports.PLANS.founder : exports.PLANS.starter;
};
