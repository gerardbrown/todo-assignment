const { User } = require('../models');
const { validateUser } = require('../utils/validation');

const createUser = async (userData) => {
    const { username, first_name, last_name, email } = userData;

    const { error } = validateUser({ username, first_name, last_name, email });
    if (error) {
        throw new Error(error.details[0].message);
    }

    const user = await User.create({ username, first_name, last_name, email });

    return user;
};

const updateUser = async (userId, userData) => {
    const { username, first_name, last_name, email } = userData;

    const { error } = validateUser({ username, first_name, last_name, email });
    if (error) {
        throw new Error(error.details[0].message);
    }

    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    user.username = username;
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    await user.save();

    return user;
};

const getAllUsers = async () => {
    const users = await User.findAll();

    return users;
};

const getUserById = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
};
