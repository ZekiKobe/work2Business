require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const errorHandler = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const businessIdeaRoutes = require("./routes/businessIdeaRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const businessPlanRoutes = require("./routes/businessPlanRoute");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Work2Business API Running", version: "2.0.0" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/business-ideas", businessIdeaRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/business-plans", businessPlanRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(errorHandler);

module.exports = app;
