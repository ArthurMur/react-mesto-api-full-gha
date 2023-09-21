const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

const AuthorizationError = require('../errors/authorizationError');

const tokenVerify = (token) => {
  try {
    return jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return '';
  }
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('token in cookies:', token);
  if (!token) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }
  const payload = tokenVerify(token);
  console.log('payload:', payload);
  if (!payload) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }

  req.user = payload;
  return next();
};
