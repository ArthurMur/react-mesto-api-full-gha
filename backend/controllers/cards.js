/* eslint-disable consistent-return */
const Card = require('../models/card');

// классы с ответами об ошибках
const RequestError = require('../errors/requestError'); // 400
const NotFoundError = require('../errors/notFoundError'); // 404
const OwnerCardError = require('../errors/ownerCardError'); // 404

// Удаление карточки
const deleteCard = (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }))
      .catch(next);
  };
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (req.user._id !== card.owner.toString()) {
        throw new OwnerCardError('Вы можете удалить только свою карточку');
      }
      return removeCard();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный Id карточки'));
      } else {
        return next(err);
      }
    });
};

// Получение карточек
const getCards = (req, res, next) => {
  Card.find()
    .then((cardList) => res.send(cardList))
    .catch(next);
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cardObject) => res.status(201).send(cardObject))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные карточки'));
      }
      return next(err);
    });
};
// Лайк карточки
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((likedCard) => {
    if (!likedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.status(201).send(likedCard);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new RequestError('Некорректный Id карточки'));
    }
    return next(err);
  });
};

// Дизлайк карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dislikedCard) => {
      if (dislikedCard) {
        res.send(dislikedCard);
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный Id карточки'));
      } else {
        return next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
