const express = require('express');
const router = express.Router();
const businessPlanController = require('../controllers/businessPlanController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.protect, businessPlanController.createBusinessPlan);
router.get('/favorites', authMiddleware.protect, businessPlanController.getFavoritePlans);
router.get('/', authMiddleware.protect, businessPlanController.getUserPlans);
router.post('/:id/favorite', authMiddleware.protect, businessPlanController.toggleFavorite);
router.get('/:id', authMiddleware.protect, businessPlanController.getPlanById);
router.delete('/:id', authMiddleware.protect, businessPlanController.deletePlan);

module.exports = router;