const request = require("supertest");
const { app, server } = require("../index");
const { User, Task } = require("../models");
const sequelize = require("../utils/db");

async function truncateAllTables() {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.query("TRUNCATE TABLE `Users`");
    await sequelize.query("TRUNCATE TABLE `Tasks`");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
}

describe('Endpoints', () => {

    beforeEach(async () => {
        await truncateAllTables();
    });

    afterAll(async () => {
        // Close the server and sequelize connection after all tests finish running.
        if (server && server.close) {
            await server.close();
        }
        await sequelize.close();
    });

    it('should create a new user', async () => {
        const userData = {
            username: 'john',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        };

        const response = await request(app).post('/api/users').send(userData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('username', userData.username);
        expect(response.body).toHaveProperty('first_name', userData.first_name);
        expect(response.body).toHaveProperty('last_name', userData.last_name);
        expect(response.body).toHaveProperty('email', userData.email);
    });

    it('should update an existing user', async () => {
        const user = await User.create({
            username: 'john',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        });

        const updatedUserData = {
            username: 'jane',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane@example.com',
        };

        const response = await request(app).put(`/api/users/${user.id}`).send(updatedUserData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', updatedUserData.username);
        expect(response.body).toHaveProperty('first_name', updatedUserData.first_name);
        expect(response.body).toHaveProperty('last_name', updatedUserData.last_name);
        expect(response.body).toHaveProperty('email', updatedUserData.email);
    });

    it('should get all users', async () => {
        await User.bulkCreate([
            { username: 'john', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
            { username: 'jane', first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' },
        ]);

        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it('should get user by ID', async () => {
        const user = await User.create({
            username: 'john',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        });
        const response = await request(app).get(`/api/users/${user.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', user.username);
        expect(response.body).toHaveProperty('first_name', user.first_name);
        expect(response.body).toHaveProperty('last_name', user.last_name);
        expect(response.body).toHaveProperty('email', user.email);
    });

    it('should return 404 when getting a non-existent user', async () => {
        const response = await request(app).get('/api/users/123');
        expect(response.status).toBe(404);
    });

    it('should create a new task for a user', async () => {
        const user = await User.create({
            username: 'john',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        });

        const taskData = {
            name: 'Do something',
            description: 'This will do something',
            status: 'pending',
            date_time: '2023-08-06 12:25:00',
        };

        const response = await request(app)
            .post(`/api/users/${user.id}/tasks`)
            .send(taskData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('name', taskData.name);
        expect(response.body).toHaveProperty('description', taskData.description);
        expect(response.body).toHaveProperty('status', taskData.status);
    });

    it('should update an existing task for a user', async () => {
        const user = await User.create({
            username: "john",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
        });

        const task = await Task.create({
            name: 'Do something',
            description: 'This will do something',
            status: 'pending',
            date_time: '2023-08-06 12:25:00',
            UserId: user.id,
        });

        const updatedTaskData = {
            name: 'Updated task',
            description: 'This will update something',
            status: 'in progress',
            date_time: '2023-08-06 12:25:00',
        };

        const response = await request(app)
            .put(`/api/users/${user.id}/tasks/${task.id}`)
            .send(updatedTaskData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', updatedTaskData.name);
        expect(response.body).toHaveProperty('description', updatedTaskData.description);
        expect(response.body).toHaveProperty('status', updatedTaskData.status);
    });

    it('should delete a task for a user', async () => {
        const user = await User.create({
            username: "john",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
        });

        const task = await Task.create({
            name: 'Do something',
            description: 'This will do something',
            status: 'pending',
            date_time: '2023-08-06 12:25:00',
            UserId: user.id,
        });

        const response = await request(app).delete(`/api/users/${user.id}/tasks/${task.id}`);
        expect(response.status).toBe(204);
    });

    it('should get all tasks for a user with pagination', async () => {
        const user = await User.create({
            username: 'john',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        });

        await Task.bulkCreate([
            {
                name: 'Task 1',
                description: 'Task 1 do something',
                status: 'pending',
                date_time: '2023-08-06 12:25:00',
                UserId: user.id,
            },
            {
                name: 'Task 2',
                description: 'Task 2 busy with something',
                status: 'in progress',
                date_time: '2023-08-06 12:25:00',
                UserId: user.id,
            },
        ]);

        const response = await request(app).get(`/api/users/${user.id}/tasks?limit=1&page=1`);
        expect(response.status).toBe(200);
        expect(response.body.tasks).toHaveLength(1);
        expect(response.body.totalCount).toBe(2);
    });

    it('should get task by ID for a user', async () => {
        const user = await User.create({
            username: "john",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
        });

        const taskData = await Task.create({
            name: 'Do something',
            description: 'This will do something',
            status: 'pending',
            date_time: '2023-08-06 12:25:00',
            UserId: user.id,
        });

        const response = await request(app).get(`/api/users/${user.id}/tasks/${taskData.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', taskData.name);
        expect(response.body).toHaveProperty('description', taskData.description);
        expect(response.body).toHaveProperty('status', taskData.status);
    });

    it('should update task status', async () => {
        const user = await User.create({
            username: "john",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
        });

        const task = await Task.create({
            name: 'Do something',
            description: 'This will do something',
            status: 'pending',
            date_time: '2023-08-06 12:25:00',
            UserId: user.id,
        });

        const updatedStatus = 'in progress';

        const response = await request(app)
            .put(`/api/users/${user.id}/tasks/${task.id}/status`)
            .send({ status: updatedStatus });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', updatedStatus);
    });

    it('should search tasks for a user', async () => {
        const user = await User.create({
            username: "john",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
        });

        await Task.bulkCreate([
            { name: 'Task 1', description: 'Task 1', status: 'pending', date_time: '2023-08-06 12:25:00', UserId: user.id },
            { name: 'Task 2', description: 'Task 2', status: 'in progress', date_time: '2023-08-06 12:25:00', UserId: user.id },
            { name: 'Another task', description: 'Another task', status: 'done', date_time: '2023-08-06 12:25:00', UserId: user.id },
        ]);

        const searchQuery = 'Task';
        const response = await request(app).get(`/api/users/${user.id}/searchTasks?query=${searchQuery}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
    });
});
