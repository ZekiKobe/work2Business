const express = require('express');
const router = express.Router();
const businessPlanController = require('../controllers/businessPlanController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.protect, businessPlanController.createBusinessPlan);
router.get('/', authMiddleware.protect, businessPlanController.getUserPlans);
router.get('/:id', authMiddleware.protect, businessPlanController.getPlanById);

module.exports = router;