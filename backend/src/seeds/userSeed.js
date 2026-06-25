require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@work2business.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existing) {
      if (existing.role !== "ADMIN") {
        existing.role = "ADMIN";
        existing.isActive = true;
        await existing.save();
        console.log(`✅ Updated existing user to ADMIN: ${ADMIN_EMAIL}`);
      } else {
        console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
      }
      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      firstName: "Platform",
      lastName: "Admin",
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      profession: "Administrator",
      employer: "Work2Business",
      role: "ADMIN",
      isActive: true,
      skills: ["Management", "Business Strategy", "Leadership"],
      interests: ["Entrepreneurship", "Technology"]
    });

    console.log("✅ Admin user created successfully");
    console.log("   Email:", ADMIN_EMAIL);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("   ⚠️  Change ADMIN_PASSWORD in .env before production!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Admin seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
