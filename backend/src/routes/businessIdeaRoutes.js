const express = require('express');
const router = express.Router();

const businessIdeaController = require('../controllers/businessIdeaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware.protect, businessIdeaController.getAllIdeas);
router.post('/compare', authMiddleware.protect, businessIdeaController.compareIdeas);
router.get('/favorites', authMiddleware.protect, businessIdeaController.getFavorites);
router.post('/:id/favorite', authMiddleware.protect, businessIdeaController.toggleFavorite);
router.get('/:id/skill-gap', authMiddleware.protect, businessIdeaController.getSkillGap);
router.post('/', authMiddleware.protect, authorizeRoles('ADMIN'), businessIdeaController.createIdea);
router.put('/:id', authMiddleware.protect, authorizeRoles('ADMIN'), businessIdeaController.updateIdea);
router.delete('/:id', authMiddleware.protect, authorizeRoles('ADMIN'), businessIdeaController.deleteIdea);

module.exports = router;
