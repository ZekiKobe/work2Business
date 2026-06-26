export const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 0,
    priceLabel: "ETB 0",
    period: "forever free",
    description: "Everything you need to discover your business path."
  },
  founder: {
    id: "founder",
    name: "Founder",
    price: 2500,
    priceLabel: "ETB 2,500",
    period: "/ year",
    description: "Unlimited power for serious entrepreneurs."
  }
};

export function getPlanCta(planId, user) {
  const sub = user?.subscription;
  const hasActiveFounder = sub?.plan === "founder" && sub?.status === "active";
  const pendingFounder = sub?.plan === "founder" && sub?.status === "pending";

  if (planId === "starter") {
    return {
      label: user ? (sub?.plan === "starter" ? "Current plan" : "Go to dashboard") : "Start for free",
      to: user ? "/dashboard" : "/register?plan=starter"
    };
  }

  if (hasActiveFounder) {
    return { label: "Current plan", to: "/dashboard" };
  }

  if (pendingFounder) {
    return { label: "Complete payment", to: "/checkout?plan=founder" };
  }

  return {
    label: user ? "Upgrade now" : "Get Founder plan",
    to: user ? "/checkout?plan=founder" : "/register?plan=founder"
  };
}
