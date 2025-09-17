const express = require('express');
const { body } = require('express-validator');
const { login, validateToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const loginValidationRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/login', loginValidationRules, login);

router.get('/validate', authMiddleware, validateToken);

module.exports = router;