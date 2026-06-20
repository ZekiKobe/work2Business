const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const registerValidator = require('../validators/authValidator').registerValidator;

router.post("/register",registerValidator, authController.register);
router.post("/login", authController.login);

module.exports = router;