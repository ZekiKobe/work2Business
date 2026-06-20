require("dotenv").config();
const mongoose = require("mongoose");
const BusinessIdea = require("../models/BusinessIdea");

const connectDB = require("../config/db");

connectDB();

const seedData = [
  {
    name: "Data Analytics Consultancy",
    description: "Help companies analyze data and build dashboards",
    category: "Tech",
    minimumCapital: 20000,
    expectedProfit: 60000,
    riskLevel: "LOW",
    requiredSkills: ["Excel", "Power BI", "SQL"]
  },
  {
    name: "Online Training Center",
    description: "Teach skills online via Zoom",
    category: "Education",
    minimumCapital: 10000,
    expectedProfit: 40000,
    riskLevel: "LOW",
    requiredSkills: ["Communication", "Teaching"]
  },
  {
    name: "Digital Marketing Agency",
    description: "Social media marketing services",
    category: "Marketing",
    minimumCapital: 30000,
    expectedProfit: 80000,
    riskLevel: "MEDIUM",
    requiredSkills: ["SEO", "Ads", "Content"]
  }
];

const seedDB = async () => {
  try {
    await BusinessIdea.deleteMany();
    await BusinessIdea.insertMany(seedData);

    console.log("Database seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();