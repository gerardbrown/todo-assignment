const executePendingTasks = require('./scheduledJob');
const { Op } = require('sequelize');

async function testCron() {
    console.log('Executing cron job...');
    await executePendingTasks(Op); // Pass Op as an argument
    console.log('Cron job executed successfully.');
}

testCron();
