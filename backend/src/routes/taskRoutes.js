const express = require('express');
const { body } = require('express-validator');
const { getTasks, createTask, updateTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const taskValidationRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').trim().isEmail().withMessage('Invalid email format'),
  body('text').trim().notEmpty().withMessage('Task text is required')
];

const updateTaskValidationRules = [
  body('text').optional().trim().notEmpty().withMessage('Task text cannot be empty'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status')
];

router.get('/', getTasks);

router.post('/', taskValidationRules, createTask);

router.put('/:id', authMiddleware, updateTaskValidationRules, updateTask);

module.exports = router;