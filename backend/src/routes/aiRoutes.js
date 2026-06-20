const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const aiControoller = require('../controllers/aiController');

router.post("/business-plan",authMiddleware.protect, aiControoller.generatePlan);

module.exports = router;