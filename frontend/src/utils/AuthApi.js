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
    return fetch(`${this._authUrl}users/me`, {
      // По умолчанию fetch — это GET, можно не указывать
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })
      .then(this._processingServerResponse)
  }
  // Метод авторизации пользователя
  authorizeUser (password, email) {
    return fetch(`${this._authUrl}signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email })
    })
      .then(this._processingServerResponse)
  }
  // Метод регистрации пользователя
  registerUser (password, email) {
    return fetch(`${this._authUrl}signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
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
}

// Создание экземпляра класса
const apiAuth = new AuthApi('http://api.domainname.students.nomoredomainsrocks.ru');
// Экспорт экземпляра класса
export default apiAuth;