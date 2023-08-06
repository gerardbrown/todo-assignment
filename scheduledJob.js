const { Task } = require('./models');
const { Op } = require('sequelize');

const executePendingTasks = async () => {
    try {
        const currentDate = new Date();
        const pendingTasks = await Task.findAll({
            where: {
                status: 'pending',
                date_time: { [Op.lte]: currentDate },
            },
        });

        if (pendingTasks.length === 0) {
            console.log('No pending tasks to execute.');
            return;
        }

        for (const task of pendingTasks) {
            task.status = 'done';
            await task.save();
            console.log(`Task ${task.id} (${task.description}) marked as "done".`);
        }
    } catch (error) {
        console.error('Error executing pending tasks:', error);
    }
};

module.exports = executePendingTasks;
