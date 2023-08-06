const { Op } = require('sequelize');
const { User } = require('../models');
const { validateUser } = require('../utils/validation');

const createUser = async (req, res) => {
    try {
        const { username, first_name, last_name, email } = req.body;

        const { error } = validateUser({ username, first_name, last_name, email });
        if (error) {
            // console.log('Validation error:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if the email or username already exists in the database
        const existingEmail = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingEmail) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        if (existingUsername) {
            return res.status(409).json({ error: 'Username already in use' });
        }

        const user = await User.create({ username, first_name, last_name, email });

        return res.status(201).json(user);
    } catch (error) {
        // console.error('Database error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, first_name, last_name, email } = req.body;

        const { error } = validateUser({ username, first_name, last_name, email });
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if the email or username already exists in the database (excluding the current user)
        const existingEmail = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
        const existingUsername = await User.findOne({ where: { username, id: { [Op.ne]: id } } });

        if (existingEmail) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        if (existingUsername) {
            return res.status(409).json({ error: 'Username already in use' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            console.error('Database error:', error);
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username;
        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
};
