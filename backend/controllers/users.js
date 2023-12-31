/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { JWT_SECRET = 'dev-secret2', NODE_ENV } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/constants');

// классы с ответами об ошибках
const RequestError = require('../errors/requestError'); // 400
const NotFoundError = require('../errors/notFoundError'); // 404
const EmailExistenceError = require('../errors/emailExistenceError'); // 409

// возвращает информацию о текущем пользователе
const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(...user);
    })
    .catch(next);
};

// Получение списка пользователей
const getUserList = (req, res, next) => {
  User.find({})
    .then((userList) => res.status(200).send(userList))
    .catch(next);
};

// Получение пользователя по ID
const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((selectedUser) => {
      if (!selectedUser) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(selectedUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('Некорректный Id пользователя'));
      }
      return next(err);
    });
};

// Создание пользователя (Регистрация)
const registerUser = (req, res, next) => {
  const { email, password } = req.body; // обязательные поля
  const { name, about, avatar } = req.body; // необязательные

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })).then((user) => {
      const { _id } = user;
      res.status(201).send({
        name, about, avatar, email, _id,
      });
    }).catch((err) => {
      if (err.code === 11000) {
        next(new EmailExistenceError('Даный email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        return next(new RequestError('Переданы некорректные данные'));
      } else {
        return next(err);
      }
    });
};

// Обновление аватара пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
      } else {
        return next(err);
      }
    });
};

// Обновление профиля пользователя
const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((updatedData) => {
      if (updatedData === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(updatedData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные пользователя'));
      } else {
        return next(err);
      }
    });
};

// Проверка почты и пароля
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === MODE_PRODUCTION ? JWT_SECRET : DEV_KEY,
        { expiresIn: '7d' },
      );
      res.send({ message: 'Успешная аутентификация', token }).end();
    })
    .catch(next);
};

module.exports = {
  getUserList,
  getUserId,
  registerUser,
  updateUserAvatar,
  updateUserData,
  login,
  getMe,
};
