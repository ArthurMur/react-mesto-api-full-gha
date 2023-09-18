/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupEditAvatar from './PopupEditAvatar';
import PopupEditProfile from "./PopupEditProfile";
import PopupAddCard from './PopupAddCard';
import CurrentUserContext from '../contexts/CurrentUserContext';
import api from '../utils/Api';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import apiAuth from '../utils/AuthApi';


function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false); // Редактирование аватара
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false); // Редактирование профиля
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false); // Добавление карточки
  const [isImageOpen, setIsImageOpen] = useState(false); // Увеличение изображения
  const [selectedCard, setSelectedCard] = useState({}); // Передача данных при увеличении изображения
  const [cards, setCards] = useState([]); // Инициализация карточек
  const [currentUser, setCurrentUser] = useState({}); // Значение для провайдера контекста
  const [email, setEmail] = useState(''); // Хранение и передача почты
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние авторизации
  const [status, setStatus] = useState(false); // Статус регистрации(авторизации), используется для Tooltip
  const [tooltipOpen, setTooltipOpen] = useState(false); // Состояние Tooltip

  // Переменная для хранения истории
  const navigate = useNavigate();

  // Рендер карточек и данных пользователя
  useEffect( () => {
    api.getAppInfo()
      .then(( [ cardData, userProfileData] ) => {
        setCurrentUser(userProfileData);
        setCards(cardData);
      })
      .catch( (err) => { console.log(`Возникла ошибка, ${err}`) })
  }, [])

  // Верификация токена пользователя
  useEffect( () => {
    const userToken = localStorage.getItem('token')
    if (userToken) { apiAuth.checkToken(userToken)
        .then( (res) => { setEmail(res.data.email); setIsLoggedIn(true); navigate('/', { replace: true }) })
        .catch( (err) => { console.log(`Возникла ошибка верификации токена, ${err}`) })
    }
  }, [isLoggedIn])

  // Функция регистрации пользователя (при успехе(провале) всплывает popup через Tooltip используя статус)
  function handleRegister (password, email) {
    apiAuth.registerUser(password, email)
      .then( () => { setTooltipOpen(true); setStatus(true) })
      .catch( (err) => { console.log(`Возникла ошибка при регистрации пользователя, ${err}`); setTooltipOpen(true); setStatus(false) })
  }

  // Функция авторизации пользователя (при неудаче всплывает popup через Tooltip используя статус)
  function handleLogin (password, email) {
    apiAuth.authorizeUser(password, email)
      .then( (res) => {
        // Если токен валиден, авторизовываем и перебрасывам на главную
        if (res.token) {
          localStorage.setItem('token', res.token);
          setEmail(email);
          setIsLoggedIn(true);
          navigate('/');
        }
      })
      .catch( (err) => { console.log(`Возникла ошибка при авторизации, ${err}`); setTooltipOpen(true); setStatus(false) })
  }

  // Функция выхода пользователя
  function handleLogout () { localStorage.removeItem('token'); setIsLoggedIn(false);  }

  // Обработчик открытия попапа обновления аватара
  function handleEditAvatarClick () { setIsEditAvatarPopupOpen(true) }
  // Обработчик открытия попапа редактирования профиля
  function handleEditProfileClick () { setIsEditProfilePopupOpen(true) }
  // Обработчик открытия попапа добавления карточки
  function handleAddPlaceClick () { setIsAddPlacePopupOpen(true) }
  // Обработчик удаления карточки
  function handleCardDelete (card) {
    api.deleteCard(card._id)
      .then( () => { setCards( (cardsArray) => cardsArray.filter( (cardItem) => cardItem._id !== card._id)) })
      .catch( (err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
  }
  // Обработчик изменения аватара
  function handleUpdateAvatar (link) {
    api.sendAvatarData(link)
      .then( (res) => { setCurrentUser(res); closeAllPopups() })
      .catch( (err) => { console.log(`Возникла ошибка при зименении аватара, ${err}`) })
  }

  // Обработчик лайков карточки
  function handleCardLike (card) {
  const isLiked = card.likes.some(cardItem => cardItem._id === currentUser._id);
  api.changeLikeCardStatus(card._id, !isLiked)
    .then( (cardsItem) => {
      setCards( (state) => state.map( (cardItem) => cardItem._id === card._id ? cardsItem : cardItem) )
    })
    .catch( (err) => { console.log(`Возникла ошибка при обработке лайков, ${err}`) })
}

  // Обработчик данных пользователя
  function handleUpdateUser (userItem) {
    api.sendUserData(userItem.name, userItem.about)
      .then( (res) => { setCurrentUser(res); closeAllPopups() })
      .catch( (err) => { console.log(`Возникла ошибка при редактировании профиля, ${err}`) })
  }

  // Обработчик добавления карточки
  function handleAddCard (cardItem) {
    api.addNewCard(cardItem.name, cardItem.link)
      .then( (card) => { setCards([card, ...cards]); closeAllPopups() })
      .catch( (err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
  }

  // Обработчик зума изображения и передачи данных
  function handleCardClick (cardItem) {
    setIsImageOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: cardItem.name,
      link: cardItem.link
    })
  }

  // Закрытие всех попапов
  function closeAllPopups () {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
    setTooltipOpen(false);
  }

  return (
    < CurrentUserContext.Provider value={ currentUser } >
      <div className="app">
        < Header
        isLoggedIn = { isLoggedIn }
        email = { email }
        isLogout = { handleLogout } />

        <div className="container">
          <Routes>
            <Route
              path='/' 
              element={
                <ProtectedRoute 
                element={ Main }
                isLoggedIn = { isLoggedIn }
                onEditAvatar = { handleEditAvatarClick }
                onEditProfile = { handleEditProfileClick }
                onAddPlace = { handleAddPlaceClick }
                onCardClick = { handleCardClick }
                onCardDelete = { handleCardDelete }
                onCardLike = { handleCardLike }
                cards={ cards }
              />}
            />
            <Route path='/sign-in' element={<Login 
              handleLogin = { handleLogin }
              isOpen = { tooltipOpen }
              onClose = { closeAllPopups }
              status = { status }
              />}
            />
            <Route path='/sign-up' element={<Register 
              handleRegister = { handleRegister }
              isOpen = { tooltipOpen }
              onClose = { closeAllPopups }
              status = { status }
              />}
            />
          </Routes>
          < Footer />
        </div>
  
        < PopupEditAvatar
          isOpen = { isEditAvatarPopupOpen }
          onClose = { closeAllPopups }
          onUpdateAvatar = { handleUpdateAvatar } />

        < PopupEditProfile
          isOpen = { isEditProfilePopupOpen }
          onClose = { closeAllPopups }
          onUpdateUser = { handleUpdateUser }/>

        < PopupAddCard
          isOpen = { isAddPlacePopupOpen }
          onClose = { closeAllPopups }
          onAddPlace = { handleAddCard } />

        < ImagePopup
          isOpen = { isImageOpen }
          onClose = { closeAllPopups }
          card = { selectedCard } />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
