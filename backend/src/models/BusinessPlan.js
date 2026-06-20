const mongoose = require('mongoose');

const businessPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    businessIdea : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessIdea",
        required: true
    },
    executiveSummary: String,
    marketAnalysis: String,
    financialPlan: String,
    marketingStrategy: String,
    riskAnalysis: String,

    intialCapital: Number,
    projectedRevenue: Number,
    projectedProfit: Number
},
{
    timestamps: true
}
);

module.exports = mongoose.model("BusinessPlan", businessPlanSchema);