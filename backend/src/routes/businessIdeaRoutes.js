const express = require('express');
const router = express.Router();

const businessIdeaController = require('../controllers/businessIdeaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware.protect, businessIdeaController.getAllIdeas);
router.post('/', authMiddleware.protect,authorizeRoles('ADMIN'), businessIdeaController.createIdea);
router.delete('/:id', authMiddleware.protect,authorizeRoles('ADMIN'), businessIdeaController.deleteIdea);   

module.exports = router;
