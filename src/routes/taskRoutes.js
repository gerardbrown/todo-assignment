// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Create a new task for a user
router.post('/users/:user_id/tasks', taskController.createTask);

// Update an existing task for a user
router.put('/users/:user_id/tasks/:task_id', taskController.updateTask);

// Delete a task for a user
router.delete('/users/:user_id/tasks/:task_id', taskController.deleteTask);

// Get all tasks for a user with pagination
router.get('/users/:user_id/tasks', taskController.getAllTasks);

// Get task information by ID for a user
router.get('/users/:user_id/tasks/:task_id', taskController.getTaskById);

// Update task status
router.put('/users/:user_id/tasks/:task_id/status', taskController.updateTaskStatus);

// Search tasks for a user
router.get('/users/:user_id/tasks/search', taskController.searchTasks);

module.exports = router;
