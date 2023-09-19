const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { URL_REGEX } = require('../utils/constants');

const {
  getUserList, getUserId, updateUserAvatar,
  updateUserData, getMe,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', auth, getUserList);
// возвращает информацию о текущем пользователе
userRouter.get('/me', auth, getMe);
// обновляет профиль
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  auth,
  updateUserData,
);
// обновляет аватар
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi
        .string()
        .pattern(URL_REGEX),
    }),
  }),
  auth,
  updateUserAvatar,
);
// возвращает пользователя по _id
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  auth,
  getUserId,
);

module.exports = userRouter;
