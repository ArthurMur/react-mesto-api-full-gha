import Cookies from 'js-cookie';
class AuthApi {
  constructor(authUrl) {
    this._authUrl = authUrl;
  }
  // Метод обработки ответа сервера
  _processingServerResponse (res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка, код ошибки: ${res.status}`);
    }
  }
  // Метод верификации токена
  checkToken (token) {
    return fetch(`${this._authUrl}/users/me`, {
      // По умолчанию fetch — это GET, можно не указывать
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        "Authorization" : `Bearer ${token}`
      },
      credentials: 'include', // теперь куки посылаются вместе с запросом
    })
      .then(this._processingServerResponse)
      .then((data) => {
        return data;
      });
  }
  // Метод авторизации пользователя
  authorizeUser (password, email) {
    return fetch(`${this._authUrl}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
      },
      credentials: 'include', // теперь куки посылаются вместе с запросом
      body: JSON.stringify({ password, email })
    })
      .then(this._processingServerResponse)
      .then((data) => {
        if (data.token) {
          Cookies.set('jwt', data.token, { expires: 7 });
        }
        return data;
      })
  }
  // Метод регистрации пользователя
  registerUser (password, email) {
    return fetch(`${this._authUrl}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
      },
      credentials: 'include', // теперь куки посылаются вместе с запросом
      body: JSON.stringify({ password, email })
    })
      .then(this._processingServerResponse)
  }
}

// Создание экземпляра класса
const apiAuth = new AuthApi('https://api.domainname.students.nomoredomainsrocks.ru');
// Экспорт экземпляра класса
export default apiAuth;