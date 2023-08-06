const Joi = require('joi');

// Validation schema for user data
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    // Add more attributes as per your project's user requirements
});

// Custom validator for date and time format "YYYY-MM-DD HH:mm:ss"
const dateTimeValidator = (value, helpers) => {
    const pattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;
    if (!pattern.test(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

// Validation schema for task data
const taskSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    status: Joi.string().valid('pending', 'in progress', 'done').optional(),
    date_time: Joi.custom(dateTimeValidator, 'date and time format').required(), // Use custom validator for date and time format as joi does not have a default date validation
    // Add more attributes as per your project's task requirements
});

const validateUser = (data) => {
    return userSchema.validate(data);
};

const validateTask = (data) => {
    return taskSchema.validate(data);
};

module.exports = { validateUser, validateTask };
