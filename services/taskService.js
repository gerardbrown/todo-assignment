const { Op } = require('sequelize');
const { Task } = require('../models');
const { validateTask } = require('../utils/validation');

const createTask = async (userId, taskData) => {
    const { description, status, next_execute_date_time } = taskData;

    const { error } = validateTask({ description, status, next_execute_date_time });
    if (error) {
        throw new Error(error.details[0].message);
    }

    const task = await Task.create({ description, status, next_execute_date_time, user_id: userId });

    return task;
};

const updateTask = async (userId, taskId, taskData) => {
    const { description, status, next_execute_date_time } = taskData;

    const { error } = validateTask({ description, status, next_execute_date_time });
    if (error) {
        throw new Error(error.details[0].message);
    }

    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) {
        throw new Error('Task not found');
    }

    task.description = description;
    task.status = status;
    task.next_execute_date_time = next_execute_date_time;
    await task.save();

    return task;
};

const deleteTask = async (userId, taskId) => {
    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) {
        throw new Error('Task not found');
    }

    await task.destroy();
};

const getAllTasksForUser = async (userId, limit, page) => {
    const offset = (page - 1) * limit;

    const tasks = await Task.findAndCountAll({ where: { user_id: userId }, limit, offset });

    return { tasks: tasks.rows, totalCount: tasks.count };
};

const getTaskByIdForUser = async (userId, taskId) => {
    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) {
        throw new Error('Task not found');
    }

    return task;
};

const updateTaskStatus = async (userId, taskId, status) => {
    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) {
        throw new Error('Task not found');
    }

    task.status = status;
    await task.save();

    return task;
};

const searchTasksForUser = async (userId, searchQuery) => {
    const tasks = await Task.findAll({
        where: {
            UserId: userId,
            [Op.or]: [
                { name: { [Op.like]: `%${searchQuery}%` } },
                { description: { [Op.like]: `%${searchQuery}%` } },
                { status: { [Op.like]: `%${searchQuery}%` } },
            ],
        },
    });

    return tasks;
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
