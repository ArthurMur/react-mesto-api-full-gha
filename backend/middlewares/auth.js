const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

const extractJwtToken = (authorization) => authorization.replace('jwt=', '');
const AuthorizationError = require('../errors/authorizationError');

const tokenVerify = (token) => {
  try {
    return jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return '';
  }
};

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;
  console.log('Token in cookies:', authorization);
  if (!authorization) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }
  const token = extractJwtToken(authorization);
  const payload = tokenVerify(token);
  console.log('Token:', token);
  console.log('Payload:', payload);
  if (!payload) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }

  req.user = payload;
  return next();
};
