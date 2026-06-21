const BusinessPlan = require('../models/BusinessPlan');
const BusinessIdea = require('../models/BusinessIdea');
const  { generateBusinessPlan } = require('../services/businessPlanService');

exports.createBusinessPlan = async (req, res) => {
    try {
        const {ideaId} = req.body;

        const idea = await BusinessIdea.findById(ideaId);
        if(!idea){
            return res.status(404).json({
                success: false,
                message: "Business Idea not found"
            });
        }

        const planData = generateBusinessPlan(req.user, idea);

        const plan = await BusinessPlan.create({
            user: req.user._id,
            businessIdea: idea._id,
            ...planData
        });

        res.status(201).json({
            success: true,
            data: plan
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success:false,
            message: error.message
        })
    }
};

exports.getUserPlans = async (req, res) => {
    try {
        const plans = await BusinessPlan.find({
            user: req.user._id
        }).populate("businessIdea");

        res.json({
            success: true,
            count: plans.length,
            data: plans
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
        
    }
};

exports.getPlanById = async (req, res) => {
    try {
        const plan = await BusinessPlan.findById(req.params.id).populate("businessIdea");

        if(!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }
        res.json({
            success: true,
            data: plan
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success:false,
            message: error.message
        })
        
    };
};

exports.deletePlan = async (req, res) => {
    try {
        await BusinessPlan.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "plan deleted"
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: " Failed to delete Plan"
        })
    }
}