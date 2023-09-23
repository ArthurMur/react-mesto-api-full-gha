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

const YOUR_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTBkN2YxMzcxNGQxZjc5ZTY3OGU3YjIiLCJpYXQiOjE2OTU0NzA3OTAsImV4cCI6MTY5NjA3NTU5MH0.-Aa6agYohsCgSv0wIrdjmfKIYqFdZBf7-thZP6_YYso'; // вставьте сюда JWT, который вернул публичный сервер
const SECRET_KEY_DEV = '344c14cb876ab8dff307813c907bf93515dd0b10409540a9c2f8e465ddf542aa'; // вставьте сюда секретный ключ для разработки из кода
try {
  const payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);
  console.log(payload);
  console.log('\x1b[31m%s\x1b[0m', `
Надо исправить. В продакшне используется тот же
секретный ключ, что и в режиме разработки.
`);
} catch (err) {
  if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Всё в порядке. Секретные ключи отличаются',
    );
  } else {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Что-то не так',
      err,
    );
  }
}
