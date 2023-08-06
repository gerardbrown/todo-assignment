const { Op } = require('sequelize');
const { Task, User } = require('../models');
const { validateTask } = require('../utils/validation');
const moment = require('moment');

const createTask = async (req, res) => {
    try {
        let { user_id } = req.params;
        let { name, description, status = "pending", date_time } = req.body;
        if (status && !["pending", "in progress", "done"].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Allowed values are: pending, in progress, done",
            });
        }
        // Validate the date format using moment.js or another library
        if (!moment(date_time, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
            return res.status(400).json({ error: 'Invalid date format for date_time' });
        }

        const { error } = validateTask({ name, description, status, date_time });
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const task = await Task.create({ name, description, status, date_time, UserId: user_id });

        return res.status(201).json(task);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        let { user_id, task_id } = req.params;
        let { name, description, status, date_time } = req.body;
        if (status && !["pending", "in progress", "done"].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Allowed values are: pending, in progress, done",
            });
        }
        // Validate the date format using moment.js or another library
        if (date_time && !moment(date_time, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
            return res.status(400).json({ error: 'Invalid date format for date_time' });
        }

        const { error } = validateTask({ name, description, date_time });
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const task = await Task.findOne({ where: { id: task_id, UserId: user_id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // If the 'status' field is not provided in the request body, use the current status of the task
        if (!status) {
            let status = task.status;
        }

        task.name = name;
        task.description = description;
        task.status = status;
        task.date_time = date_time;
        await task.save();

        return res.status(200).json(task);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { user_id, task_id } = req.params;

        const task = await Task.findOne({ where: { id: task_id, UserId: user_id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.destroy();

        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const getAllTasksForUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        let { limit = 10, page = 1 } = req.query;

        // Convert limit and page to integers
        limit = parseInt(limit, 10);
        page = parseInt(page, 10);

        // Check if limit and page are valid positive integers
        if (isNaN(limit) || limit <= 0 || isNaN(page) || page <= 0) {
            return res.status(400).json({ error: 'Invalid limit or page value' });
        }

        const offset = (page - 1) * limit;

        const tasks = await Task.findAndCountAll({ where: { UserId: user_id }, limit, offset });

        return res.status(200).json({ tasks: tasks.rows, totalCount: tasks.count });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const getTaskByIdForUser = async (req, res) => {
    try {
        const { user_id, task_id } = req.params;

        const task = await Task.findOne({ where: { id: task_id, UserId: user_id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { user_id, task_id } = req.params;
        const { status } = req.body;

        const task = await Task.findOne({ where: { id: task_id, UserId: user_id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.status = status;
        await task.save();

        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const searchTasksForUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        let { query } = req.query;
        const tasks = await Task.findAll({
            where: {
                UserId: user_id,
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } },
                    { status: { [Op.like]: `%${query}%` } },
                ],
            },
        });
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getAllTasksForUser,
    getTaskByIdForUser,
    updateTaskStatus,
    searchTasksForUser,
};
