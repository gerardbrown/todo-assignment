const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/api/users', userController.createUser);
router.put('/api/users/:id', userController.updateUser);
router.get('/api/users', userController.getAllUsers);
router.get('/api/users/:id', userController.getUserById);

module.exports = router;
