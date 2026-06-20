const { body } = require('express-validator');

exports.registerValidator = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];