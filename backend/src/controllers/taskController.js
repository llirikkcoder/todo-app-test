const { Task } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const sanitizeHtml = require('../utils/sanitize');

const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;
    const { sortBy, sortOrder } = req.query;

    const validSortFields = ['username', 'email', 'status'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'id';
    const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';

    const { count, rows } = await Task.findAndCountAll({
      limit,
      offset,
      order: [[orderField, orderDirection]],
      attributes: ['id', 'username', 'email', 'text', 'status', 'createdAt']
    });

    const sanitizedRows = rows.map(task => ({
      ...task.toJSON(),
      text: sanitizeHtml(task.text),
      username: sanitizeHtml(task.username),
      email: sanitizeHtml(task.email)
    }));

    res.json({
      tasks: sanitizedRows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTasks: count
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, text } = req.body;

    const sanitizedData = {
      username: sanitizeHtml(username),
      email: sanitizeHtml(email),
      text: sanitizeHtml(text)
    };

    const task = await Task.create(sanitizedData);

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        ...task.toJSON(),
        text: sanitizedData.text,
        username: sanitizedData.username,
        email: sanitizedData.email
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { text, status } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateData = {};

    if (text !== undefined && text !== task.text) {
      updateData.text = sanitizeHtml(text);
      updateData.editedByAdmin = true;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    await task.update(updateData);

    res.json({
      message: 'Task updated successfully',
      task: {
        ...task.toJSON(),
        text: task.text,
        username: task.username,
        email: task.email
      }
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask
};