const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/users', userController.createUser);

// Update an existing user
router.put('/users/:id', userController.updateUser);

// Get all users
router.get('/users', userController.getAllUsers);

// Get user by ID
router.get('/users/:id', userController.getUserById);

// Delete a user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
