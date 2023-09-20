import Cookies from 'js-cookie';
export class Api {
  constructor(data) {
    this._link = data.link;
    this._headers = {
      ...data.headers, 
      authorization: `Bearer ${Cookies.get('token')}`};
  }
  //Метод отбраоботки сервера 
  _checkResponse(res){
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  } 
  //Инициализация карточек с сервака
  getInitialCards(){
    return fetch(`${this._link}/cards`, {
    headers: this._headers,
    credentials: 'include', // теперь куки посылаются вместе с запросом
    })
    .then(this._checkResponse);
  }

  // Получение информации карточек и информации от пользователя
  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserData()]); // передаю массив промисов. Первыми - карточки, вторым запрос к информации о пользователе
  }

  //Добавление новой карточки на сервак
  addNewCard(name, link){
    return fetch(`${this._link}/cards`, {
      headers: this._headers,
      credentials: 'include', // теперь куки посылаются вместе с запросом
      method: 'POST',
      body: JSON.stringify({ name, link })
    })
      .then(this._checkResponse)
  }
  
  // Удаления карточки с сервака
  deleteCard(cardId) {
    return fetch(`${this._link}/cards/${cardId}`, {
      headers: this._headers,
      credentials: 'include', // теперь куки посылаются вместе с запросом
      method: 'DELETE',
    })
      .then(this._checkResponse)
  }

  // Получение данных пользователя с сервака
  getUserData() {
  return fetch(`${this._link}/users/me`, {
    headers: this._headers,
    credentials: 'include', // теперь куки посылаются вместе с запросом
  })
    .then(this._checkResponse)
  }

  // Отправка данных пользователя на сервак
  sendUserData(userName, userAbout) {
    return fetch(`${this._link}/users/me`, {
      headers: this._headers,
      credentials: 'include', // теперь куки посылаются вместе с запросом
      method: 'PATCH',
      body: JSON.stringify({ name: userName, about: userAbout })
    })
      .then(this._checkResponse)
  }

  // Отправка данных о новом аватаре на сервак
  sendAvatarData(avatarLink) {
    return fetch(`${this._link}/users/me/avatar`, {
      headers: this._headers,
      credentials: 'include', // теперь куки посылаются вместе с запросом
      method: 'PATCH',
      body: JSON.stringify({ avatar: avatarLink.avatar })
    })
      .then(this._checkResponse)
  }

  // Метод обработки лайков карточки
  changeLikeCardStatus (cardId, isLiked) {
    if (isLiked) {
      return fetch(`${this._link}/cards/${cardId}/likes`, {
        headers: this._headers,
        credentials: 'include', // теперь куки посылаются вместе с запросом
        method: 'PUT',
      })
      .then(this._checkResponse)
    } else {
      return fetch(`${this._link}/cards/${cardId}/likes`, {
        headers: this._headers,
        credentials: 'include', // теперь куки посылаются вместе с запросом
        method: 'DELETE',
      })
      .then(this._checkResponse)
    }
  }
}

const api = new Api({
  link: 'https://api.domainname.students.nomoredomainsrocks.ru',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;