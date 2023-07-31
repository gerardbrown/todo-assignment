// tests/task.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../src/config/db');
const { User, Task } = require('../src/models');

describe('Task Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterEach(async () => {
        await User.destroy({ where: {} });
    });

    it('should create a new task for a user', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(user);

        const task = {
            name: 'New Task',
            description: 'Description of the task',
            dateTime: '2023-08-01T12:00:00',
        };

        const createTaskResponse = await request(app)
            .post(`/api/users/${createUserResponse.body.id}/tasks`)
            .send(task);

        expect(createTaskResponse.status).toBe(201);
        expect(createTaskResponse.body).toHaveProperty('id');
        expect(createTaskResponse.body.name).toBe(task.name);
        expect(createTaskResponse.body.description).toBe(task.description);
        expect(createTaskResponse.body.dateTime).toBe(task.dateTime);
        expect(createTaskResponse.body.UserId).toBe(createUserResponse.body.id);
    });

    it('should not create a new task with invalid data', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        await request(app).post('/api/users').send(user);

        const invalidTask = {
            description: 'Description of the task',
            dateTime: '2023-08-01T12:00:00',
        };

        const createTaskResponse = await request(app)
            .post(`/api/users/${user.id}/tasks`)
            .send(invalidTask);

        expect(createTaskResponse.status).toBe(400);
        expect(createTaskResponse.body).toHaveProperty('message', 'Validation Error');
    });

    it('should update an existing task for a user', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(user);

        const task = {
            name: 'New Task',
            description: 'Description of the task',
            dateTime: '2023-08-01T12:00:00',
        };

        const createTaskResponse = await request(app)
            .post(`/api/users/${createUserResponse.body.id}/tasks`)
            .send(task);

        const updatedTask = {
            name: 'Updated Task',
            description: 'Updated description',
            dateTime: '2023-08-02T14:00:00',
        };

        const updateTaskResponse = await request(app)
            .put(`/api/users/${createUserResponse.body.id}/tasks/${createTaskResponse.body.id}`)
            .send(updatedTask);

        expect(updateTaskResponse.status).toBe(200);
        expect(updateTaskResponse.body.name).toBe(updatedTask.name);
        expect(updateTaskResponse.body.description).toBe(updatedTask.description);
        expect(updateTaskResponse.body.dateTime).toBe(updatedTask.dateTime);
        expect(updateTaskResponse.body.UserId).toBe(createUserResponse.body.id);
    });

    it('should not update a task with invalid data', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(user);

        const task = {
            name: 'New Task',
            description: 'Description of the task',
            dateTime: '2023-08-01T12:00:00',
        };

        const createTaskResponse = await request(app)
            .post(`/api/users/${createUserResponse.body.id}/tasks`)
            .send(task);

        const invalidTask = {
            description: 'Updated description',
            dateTime: '2023-08-02T14:00:00',
        };

        const updateTaskResponse = await request(app)
            .put(`/api/users/${createUserResponse.body.id}/tasks/${createTaskResponse.body.id}`)
            .send(invalidTask);

        expect(updateTaskResponse.status).toBe(400);
        expect(updateTaskResponse.body).toHaveProperty('message', 'Validation Error');
    });

    it('should delete an existing task for a user', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(user);

        const task = {
            name: 'New Task',
            description: 'Description of the task',
            dateTime: '2023-08-01T12:00:00',
        };

        const createTaskResponse = await request(app)
            .post(`/api/users/${createUserResponse.body.id}/tasks`)
            .send(task);

        const deleteTaskResponse = await request(app)
            .delete(`/api/users/${createUserResponse.body.id}/tasks/${createTaskResponse.body.id}`);

        expect(deleteTaskResponse.status).toBe(200);
        expect(deleteTaskResponse.body).toHaveProperty(
            'message',
            'Task deleted successfully'
        );
    });

    it('should not delete a task with invalid ID', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(user);

        const deleteTaskResponse = await request(app)
            .delete(`/api/users/${createUserResponse.body.id}/tasks/123456`);

        expect(deleteTaskResponse.status).toBe(404);
        expect(deleteTaskResponse.body).toHaveProperty('message', 'Task not found');
    });

    it('should get all tasks for a user', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(user);

        const task1 = {
            name: 'Task 1',
            description: 'Description of task 1',
            dateTime: '2023-08-01T12:00:00',
        };

        const task2 = {
            name: 'Task 2',
            description: 'Description of task 2',
            dateTime: '2023-08-02T14:00:00',
        };

        await request(app)
            .post(`/api/users/${createUserResponse.body.id}/tasks`)
            .send(task1);

        await request(app)
            .post(`/api/users/${createUserResponse.body.id}/tasks`)
            .send(task2);

        const getTasksResponse = await request(app)
            .get(`/api/users/${createUserResponse.body.id}/tasks`)
            .query({ limit: 10, page: 1 });

        expect(getTasksResponse.status).toBe(200);
        expect(getTasksResponse.body).toHaveLength(2);
    });

    it('should get a task by ID for a user', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(user);

        const task = {
            name: 'New Task',
            description: 'Description of the task',
            dateTime: '2023-08-01T12:00:00',
        };

        const createTaskResponse = await request(app)
            .post(`/api/users/${createUserResponse.body.id}/tasks`)
            .send(task);

        const getTaskResponse = await request(app)
            .get(`/api/users/${createUserResponse.body.id}/tasks/${createTaskResponse.body.id}`);

        expect(getTaskResponse.status).toBe(200);
        expect(getTaskResponse.body.name).toBe(task.name);
        expect(getTaskResponse.body.description).toBe(task.description);
        expect(getTaskResponse.body.dateTime).toBe(task.dateTime);
        expect(getTaskResponse.body.UserId).toBe(createUserResponse.body.id);
    });

    it('should not get a task with invalid ID for a user', async () => {
        const user = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        await request(app).post('/api/users').send(user);

        const getTaskResponse = await request(app)
            .get(`/api/users/${user.id}/tasks/123456`);

        expect(getTaskResponse.status).toBe(404);
        expect(getTaskResponse.body).toHaveProperty('message', 'Task not found');
    });
});
