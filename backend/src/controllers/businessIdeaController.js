const BusinessIdea = require('../models/BusinessIdea');

exports.getAllIdeas = async (req, res) => {
    try {
        const ideas = await BusinessIdea.find();

        res.status(200).json({
            success: true,
            ideas
        }); 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch business ideas"
        });
    }
};

exports.createIdea = async (req, res) => {
    try {
        const ideas = await BusinessIdea.create(req.body);

        res.status(201).json({
            success: true,
            data: ideas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create business idea"
        });
    }   
};

exports.deleteIdea = async (req, res) => {
    try {
        const idea = await BusinessIdea.findByIdAndDelete(req.params.id);

        if (!idea) {
            return res.status(404).json({
                success: false,
                message: "Business idea not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Business idea deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete business idea"
        });
    }
};

