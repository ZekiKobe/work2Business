const mongoose = require("mongoose");

const businessIdeaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: string,
    minimumCapital:Number,
    expectedProfit:Number,

    riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
    },
    requiredSkills: [
        {
            type: String
        }
    ]
},
{
    timestamps:true
}
);

module.exports = mongoose.model("BusinessIdea", businessIdeaSchema);