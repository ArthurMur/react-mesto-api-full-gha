const signinRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login } = require('../controllers/users');

signinRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

module.exports = signinRouter;
