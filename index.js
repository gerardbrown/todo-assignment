const express = require('express');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const executePendingTasks = require('./scheduledJob');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);


// Create the server using app.listen and return the server object
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


if (process.env.NODE_ENV !== 'test') {
    // Schedule the job to run every minute, but only if not running in test mode
    const cron = require('node-cron');
    cron.schedule('* * * * *', () => {
        executePendingTasks();
    });
}

module.exports = { app, server };
