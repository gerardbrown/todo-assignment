// tests/user.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../src/config/db');
const { User } = require('../src/models');

describe('User Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterEach(async () => {
        await User.destroy({ where: {} });
    });

    it('should create a new user', async () => {
        const newUser = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const response = await request(app).post('/api/users').send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(newUser.username);
        expect(response.body.firstName).toBe(newUser.firstName);
        expect(response.body.lastName).toBe(newUser.lastName);
    });

    it('should not create a new user with invalid data', async () => {
        const invalidUser = {
            firstName: 'Invalid',
            lastName: 'User',
        };

        const response = await request(app).post('/api/users').send(invalidUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Validation Error');
    });

    it('should update an existing user', async () => {
        const existingUser = {
            username: 'existinguser',
            firstName: 'Existing',
            lastName: 'User',
        };

        const updatedUser = {
            username: 'updateduser',
            firstName: 'Updated',
            lastName: 'User',
        };

        const createUserResponse = await request(app)
            .post('/api/users')
            .send(existingUser);

        const userId = createUserResponse.body.id;

        const updateUserResponse = await request(app)
            .put(`/api/users/${userId}`)
            .send(updatedUser);

        expect(updateUserResponse.status).toBe(200);
        expect(updateUserResponse.body.username).toBe(updatedUser.username);
        expect(updateUserResponse.body.firstName).toBe(updatedUser.firstName);
        expect(updateUserResponse.body.lastName).toBe(updatedUser.lastName);
    });

    it('should not update a user with invalid data', async () => {
        const existingUser = {
            username: 'existinguser',
            firstName: 'Existing',
            lastName: 'User',
        };

        const updateUserResponse = await request(app)
            .put('/api/users/123456')
            .send(existingUser);

        expect(updateUserResponse.status).toBe(404);
        expect(updateUserResponse.body).toHaveProperty('message', 'User not found');
    });

    it('should delete an existing user', async () => {
        const existingUser = {
            username: 'existinguser',
            firstName: 'Existing',
            lastName: 'User',
        };

        const createUserResponse = await request(app)
            .post('/api/users')
            .send(existingUser);

        const userId = createUserResponse.body.id;

        const deleteUserResponse = await request(app).delete(`/api/users/${userId}`);

        expect(deleteUserResponse.status).toBe(200);
        expect(deleteUserResponse.body).toHaveProperty(
            'message',
            'User deleted successfully'
        );
    });

    it('should not delete a user with invalid ID', async () => {
        const deleteUserResponse = await request(app).delete('/api/users/123456');

        expect(deleteUserResponse.status).toBe(404);
        expect(deleteUserResponse.body).toHaveProperty('message', 'User not found');
    });

    it('should get all users', async () => {
        const user1 = {
            username: 'user1',
            firstName: 'User',
            lastName: 'One',
        };

        const user2 = {
            username: 'user2',
            firstName: 'User',
            lastName: 'Two',
        };

        await request(app).post('/api/users').send(user1);
        await request(app).post('/api/users').send(user2);

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it('should get a user by ID', async () => {
        const newUser = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        };

        const createUserResponse = await request(app).post('/api/users').send(newUser);

        const userId = createUserResponse.body.id;

        const response = await request(app).get(`/api/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe(newUser.username);
        expect(response.body.firstName).toBe(newUser.firstName);
        expect(response.body.lastName).toBe(newUser.lastName);
    });

    it('should not get a user with invalid ID', async () => {
        const response = await request(app).get('/api/users/123456');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
    });
});
