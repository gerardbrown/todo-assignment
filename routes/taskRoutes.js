const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/api/users/:user_id/tasks', taskController.createTask);
router.put('/api/users/:user_id/tasks/:task_id', taskController.updateTask);
router.delete('/api/users/:user_id/tasks/:task_id', taskController.deleteTask);
router.get('/api/users/:user_id/tasks', taskController.getAllTasksForUser);
router.get('/api/users/:user_id/tasks/:task_id', taskController.getTaskByIdForUser);
router.put('/api/users/:user_id/tasks/:task_id/status', taskController.updateTaskStatus);
router.get('/api/users/:user_id/searchTasks', taskController.searchTasksForUser);

module.exports = router;
