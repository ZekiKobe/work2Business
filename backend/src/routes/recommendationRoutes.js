const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const recommendationController = require('../controllers/recommendationController');

router.get('/', authMiddleware.protect, recommendationController.getRecommendations);

module.exports = router;