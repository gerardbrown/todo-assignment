// src/controllers/taskController.js
const { User, Task } = require('../models');

// Create a new task for a user
exports.createTask = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { name, description, dateTime } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.create({
            name,
            description,
            dateTime,
            UserId: user_id,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update an existing task for a user
exports.updateTask = async (req, res) => {
    try {
        const { user_id, task_id } = req.params;
        const { name, description, dateTime } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.findOne({
            where: { id: task_id, UserId: user_id },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.name = name;
        task.description = description;
        task.dateTime = dateTime;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Delete a task for a user
exports.deleteTask = async (req, res) => {
    try {
        const { user_id, task_id } = req.params;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.findOne({
            where: { id: task_id, UserId: user_id },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get all tasks for a user with pagination
exports.getAllTasks = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { limit = 10, page = 1 } = req.query;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = await Task.findAll({
            where: { UserId: user_id },
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get task information by ID for a user
exports.getTaskById = async (req, res) => {
    try {
        const { user_id, task_id } = req.params;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.findOne({
            where: { id: task_id, UserId: user_id },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { user_id, task_id } = req.params;
        const { status } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.findOne({
            where: { id: task_id, UserId: user_id },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Search tasks for a user
exports.searchTasks = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { query } = req.query;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = await Task.findAll({
            where: {
                UserId: user_id,
                name: {
                    [Op.iLike]: `%${query}%`,
                },
            },
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
