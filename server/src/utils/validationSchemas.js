const Joi = require('joi');

const taskSchema = Joi.object({
    title: Joi.string().required().min(1).max(100).messages({
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title must be at least 1 character',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
    }),
    description: Joi.string().allow('').max(500),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
    status: Joi.string().valid('Active', 'Completed').default('Active'),
    isCompleted: Joi.boolean(),
    dueDate: Joi.date().allow(null),
    endDate: Joi.date().allow(null),
    tags: Joi.array().items(Joi.string()),
    location: Joi.string().allow(''),
    subtasks: Joi.array().items(
        Joi.object({
            text: Joi.string().required(),
            isCompleted: Joi.boolean()
        })
    ),
    aiSuggestions: Joi.array().items(Joi.string())
});

const registerSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6)
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    taskSchema,
    registerSchema,
    loginSchema
};