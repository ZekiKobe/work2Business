const BusinessIdea = require('../models/BusinessIdea');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

const VALID_RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"];

function normalizeIdeaPayload(body = {}) {
  const data = { ...body };

  if (data.profitPotential !== undefined && data.expectedProfit === undefined) {
    data.expectedProfit = data.profitPotential;
  }

  delete data.maximumCapital;
  delete data.profitPotential;

  if (data.riskLevel) {
    const upper = String(data.riskLevel).toUpperCase();
    if (VALID_RISK_LEVELS.includes(upper)) {
      data.riskLevel = upper;
    } else {
      delete data.riskLevel;
    }
  }

  if (data.isActive !== undefined) {
    data.isActive = Boolean(data.isActive);
  }

  return data;
}

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
        const ideas = await BusinessIdea.create(normalizeIdeaPayload(req.body));

        res.status(201).json({
            success: true,
            data: ideas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create business idea"
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

// Toggle favorite — POST /business-ideas/:id/favorite
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const ideaId = req.params.id;

        const idea = await BusinessIdea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ success: false, message: "Business idea not found" });
        }

        const index = user.favoriteIdeas.indexOf(ideaId);
        let isFavorited;
        if (index === -1) {
            user.favoriteIdeas.push(ideaId);
            isFavorited = true;
        } else {
            user.favoriteIdeas.splice(index, 1);
            isFavorited = false;
        }
        await user.save();

        if (isFavorited) {
            await createNotification(
                user._id,
                "IDEA_FAVORITED",
                "Idea Bookmarked",
                `"${idea.name}" has been saved to your favorites.`,
                "/recommendations"
            );
        }

        res.status(200).json({ success: true, isFavorited, favoriteCount: user.favoriteIdeas.length });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to toggle favorite" });
    }
};

// Get user's favorite ideas — GET /business-ideas/favorites
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("favoriteIdeas");
        res.status(200).json({ success: true, favorites: user.favoriteIdeas });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch favorites" });
    }
};

// Skill gap analysis — GET /business-ideas/:id/skill-gap
exports.getSkillGap = async (req, res) => {
    try {
        const idea = await BusinessIdea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ success: false, message: "Business idea not found" });
        }

        const user = await User.findById(req.user._id);
        const userSkillsLower = (user.skills || []).map(s => s.toLowerCase().trim());
        const requiredSkills = idea.requiredSkills || [];

        const matched = [];
        const missing = [];

        const LEARNING_RESOURCES = {
            "data analysis": { platform: "Coursera", url: "https://www.coursera.org/search?query=data+analysis", label: "Data Analysis Course" },
            "marketing": { platform: "HubSpot Academy", url: "https://academy.hubspot.com/", label: "Free Marketing Certification" },
            "excel": { platform: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/", label: "Excel Training" },
            "python": { platform: "freeCodeCamp", url: "https://www.freecodecamp.org/", label: "Python Fundamentals" },
            "social media": { platform: "Meta Blueprint", url: "https://www.facebook.com/business/learn", label: "Social Media Marketing" },
            "communication": { platform: "LinkedIn Learning", url: "https://www.linkedin.com/learning/", label: "Business Communication" },
            "sales": { platform: "HubSpot Academy", url: "https://academy.hubspot.com/courses/sales-training", label: "Sales Skills" },
            "project management": { platform: "PMI", url: "https://www.pmi.org/learning/training-development/online-courses", label: "Project Management" },
        };

        requiredSkills.forEach(skill => {
            const skillLower = skill.toLowerCase().trim();
            const isMatched = userSkillsLower.some(us => us.includes(skillLower) || skillLower.includes(us));
            if (isMatched) {
                matched.push(skill);
            } else {
                const resourceKey = Object.keys(LEARNING_RESOURCES).find(k => skillLower.includes(k) || k.includes(skillLower));
                missing.push({
                    skill,
                    resource: resourceKey ? LEARNING_RESOURCES[resourceKey] : {
                        platform: "LinkedIn Learning",
                        url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(skill)}`,
                        label: `Learn ${skill}`
                    }
                });
            }
        });

        const coveragePercent = requiredSkills.length > 0
            ? Math.round((matched.length / requiredSkills.length) * 100)
            : 100;

        res.status(200).json({
            success: true,
            ideaName: idea.name,
            coveragePercent,
            matched,
            missing,
            totalRequired: requiredSkills.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to compute skill gap" });
    }
};

// Update idea (admin) — PUT /business-ideas/:id
exports.updateIdea = async (req, res) => {
    try {
        const idea = await BusinessIdea.findByIdAndUpdate(
            req.params.id,
            normalizeIdeaPayload(req.body),
            { new: true, runValidators: true }
        );
        if (!idea) return res.status(404).json({ success: false, message: "Business idea not found" });
        res.status(200).json({ success: true, idea });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to update business idea" });
    }
};

// Compare two ideas — POST /business-ideas/compare
exports.compareIdeas = async (req, res) => {
    try {
        const { ideaIdA, ideaIdB } = req.body;
        if (!ideaIdA || !ideaIdB) {
            return res.status(400).json({ success: false, message: "Provide ideaIdA and ideaIdB" });
        }
        const [ideaA, ideaB] = await Promise.all([
            BusinessIdea.findById(ideaIdA),
            BusinessIdea.findById(ideaIdB)
        ]);
        if (!ideaA || !ideaB) {
            return res.status(404).json({ success: false, message: "One or both ideas not found" });
        }
        res.status(200).json({ success: true, ideaA, ideaB });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to compare ideas" });
    }
};

