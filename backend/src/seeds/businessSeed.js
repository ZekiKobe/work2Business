require("dotenv").config();
const mongoose = require("mongoose");
const BusinessIdea = require("../models/BusinessIdea");
const connectDB = require("../config/db");

connectDB();

const seedData = [
  {
    name: "Data Analytics Consultancy",
    description: "Help companies analyze data, build dashboards, and generate actionable business insights from raw data.",
    category: "Technology",
    minimumCapital: 20000,
    expectedProfit: 180000,
    riskLevel: "LOW",
    requiredSkills: ["Excel", "Power BI", "SQL", "Data Analysis"],
    tags: ["technology", "consulting", "data", "b2b"],
    timeToProfit: 3,
    hoursRequiredPerWeek: 25,
    successRate: 78
  },
  {
    name: "Online Training & Coaching Center",
    description: "Teach professional skills online via Zoom, self-paced video courses, and live bootcamps.",
    category: "Education",
    minimumCapital: 10000,
    expectedProfit: 120000,
    riskLevel: "LOW",
    requiredSkills: ["Communication", "Teaching", "Content Creation"],
    tags: ["education", "online", "coaching", "training"],
    timeToProfit: 2,
    hoursRequiredPerWeek: 20,
    successRate: 72
  },
  {
    name: "Digital Marketing Agency",
    description: "Full-service social media marketing, SEO, paid ads, and content strategy for SMEs.",
    category: "Marketing",
    minimumCapital: 30000,
    expectedProfit: 240000,
    riskLevel: "MEDIUM",
    requiredSkills: ["SEO", "Social Media", "Copywriting", "Ads Management"],
    tags: ["marketing", "digital", "agency", "social media", "b2b"],
    timeToProfit: 4,
    hoursRequiredPerWeek: 35,
    successRate: 65
  },
  {
    name: "Personal Finance Consulting",
    description: "Help individuals and small businesses with budgeting, investment planning, and debt management.",
    category: "Finance",
    minimumCapital: 15000,
    expectedProfit: 150000,
    riskLevel: "LOW",
    requiredSkills: ["Financial Planning", "Excel", "Accounting", "Communication"],
    tags: ["finance", "consulting", "personal finance", "investment"],
    timeToProfit: 3,
    hoursRequiredPerWeek: 20,
    successRate: 74
  },
  {
    name: "E-commerce Store",
    description: "Import and sell products online via Telebirr, social media shops, or your own Shopify store.",
    category: "Retail",
    minimumCapital: 50000,
    expectedProfit: 200000,
    riskLevel: "MEDIUM",
    requiredSkills: ["Sales", "Marketing", "Customer Service", "Logistics"],
    tags: ["retail", "e-commerce", "products", "online selling"],
    timeToProfit: 5,
    hoursRequiredPerWeek: 30,
    successRate: 60
  },
  {
    name: "HR & Recruitment Consultancy",
    description: "Help companies source, screen, and hire top talent. Offer employer branding and onboarding services.",
    category: "Consulting",
    minimumCapital: 12000,
    expectedProfit: 160000,
    riskLevel: "LOW",
    requiredSkills: ["HR Management", "Communication", "Networking", "Interviewing"],
    tags: ["hr", "consulting", "recruitment", "talent", "b2b"],
    timeToProfit: 3,
    hoursRequiredPerWeek: 25,
    successRate: 76
  },
  {
    name: "Software Development Studio",
    description: "Build web apps, mobile apps, and automation tools for startups and established businesses.",
    category: "Technology",
    minimumCapital: 40000,
    expectedProfit: 360000,
    riskLevel: "MEDIUM",
    requiredSkills: ["Programming", "JavaScript", "Python", "Project Management"],
    tags: ["technology", "software", "development", "startup", "b2b"],
    timeToProfit: 5,
    hoursRequiredPerWeek: 40,
    successRate: 68
  },
  {
    name: "Graphic Design & Branding Studio",
    description: "Provide logo design, brand identity, UI/UX, and marketing collateral for growing businesses.",
    category: "Creative",
    minimumCapital: 8000,
    expectedProfit: 96000,
    riskLevel: "LOW",
    requiredSkills: ["Graphic Design", "Adobe Suite", "Branding", "UI/UX"],
    tags: ["creative", "design", "branding", "freelance"],
    timeToProfit: 2,
    hoursRequiredPerWeek: 20,
    successRate: 70
  },
  {
    name: "Health & Wellness Coaching",
    description: "Offer personal training, nutrition coaching, and corporate wellness programs online and in-person.",
    category: "Health",
    minimumCapital: 10000,
    expectedProfit: 90000,
    riskLevel: "LOW",
    requiredSkills: ["Nutrition", "Fitness Training", "Coaching", "Communication"],
    tags: ["health", "wellness", "fitness", "coaching"],
    timeToProfit: 3,
    hoursRequiredPerWeek: 25,
    successRate: 71
  },
  {
    name: "Legal & Compliance Advisory",
    description: "Help businesses with contract drafting, regulatory compliance, business registration, and legal risk management.",
    category: "Consulting",
    minimumCapital: 25000,
    expectedProfit: 300000,
    riskLevel: "LOW",
    requiredSkills: ["Legal Knowledge", "Communication", "Research", "Documentation"],
    tags: ["legal", "consulting", "compliance", "b2b"],
    timeToProfit: 4,
    hoursRequiredPerWeek: 30,
    successRate: 80
  },
  {
    name: "Event Planning & Management",
    description: "Organize corporate events, conferences, weddings, and social gatherings end-to-end.",
    category: "Creative",
    minimumCapital: 35000,
    expectedProfit: 180000,
    riskLevel: "MEDIUM",
    requiredSkills: ["Project Management", "Communication", "Logistics", "Creativity"],
    tags: ["events", "creative", "management", "hospitality"],
    timeToProfit: 4,
    hoursRequiredPerWeek: 35,
    successRate: 62
  },
  {
    name: "Content Creation & Influencer Agency",
    description: "Build a personal brand on YouTube, TikTok, or Instagram and monetize through brand partnerships and courses.",
    category: "Marketing",
    minimumCapital: 8000,
    expectedProfit: 120000,
    riskLevel: "HIGH",
    requiredSkills: ["Content Creation", "Video Editing", "Social Media", "Storytelling"],
    tags: ["content", "social media", "influencer", "branding", "creative"],
    timeToProfit: 8,
    hoursRequiredPerWeek: 30,
    successRate: 45
  },
  {
    name: "IT Support & Managed Services",
    description: "Provide tech support, network setup, cybersecurity, and cloud services to small and medium businesses.",
    category: "Technology",
    minimumCapital: 20000,
    expectedProfit: 200000,
    riskLevel: "LOW",
    requiredSkills: ["IT Support", "Networking", "Cybersecurity", "Cloud Services"],
    tags: ["technology", "it support", "managed services", "b2b"],
    timeToProfit: 3,
    hoursRequiredPerWeek: 30,
    successRate: 77
  },
  {
    name: "Food & Catering Business",
    description: "Prepare and deliver home-cooked meals, operate a catering service for events and corporates.",
    category: "Food & Beverage",
    minimumCapital: 30000,
    expectedProfit: 140000,
    riskLevel: "MEDIUM",
    requiredSkills: ["Cooking", "Food Safety", "Business Management", "Customer Service"],
    tags: ["food", "catering", "hospitality", "events"],
    timeToProfit: 4,
    hoursRequiredPerWeek: 40,
    successRate: 58
  },
  {
    name: "Real Estate & Property Management",
    description: "Rent, manage, and broker residential and commercial properties. Build passive income through property.",
    category: "Finance",
    minimumCapital: 100000,
    expectedProfit: 400000,
    riskLevel: "HIGH",
    requiredSkills: ["Negotiation", "Financial Analysis", "Marketing", "Property Law"],
    tags: ["real estate", "investment", "property", "finance"],
    timeToProfit: 12,
    hoursRequiredPerWeek: 25,
    successRate: 65
  }
];

const seedDB = async () => {
  try {
    await BusinessIdea.deleteMany();
    await BusinessIdea.insertMany(seedData);
    console.log(`✅ Database seeded with ${seedData.length} business ideas`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDB();
