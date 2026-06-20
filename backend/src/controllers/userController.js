const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const { profession, employer, monthlySalary, availableCapital, skills} = req.body;
        
        const user = await User.findByIdAndUpdate(req.user._id, {
            profession,
            employer,
            monthlySalary,
            availableCapital,
            skills
        }, {
            new: true
        });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        
    }
}