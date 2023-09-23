const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET = 'dev-secret2', NODE_ENV = 'production' } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/constants');

const AuthorizationError = require('../errors/authorizationError');

const tokenVerify = (token) => {
  try {
    return jwt.verify(token, NODE_ENV === MODE_PRODUCTION ? JWT_SECRET : DEV_KEY);
  } catch (err) {
    return '';
  }
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }
  const payload = tokenVerify(token);
  if (!payload) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }

  req.user = payload;
  return next();
};
