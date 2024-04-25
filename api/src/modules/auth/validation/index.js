const Joi = require("joi");

const registration = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

const login = Joi.object({
  email: Joi.string().min(5).required(),
  password: Joi.string().min(3).max(30),
});

module.exports = { registration, login };
