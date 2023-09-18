import React from 'react';
import success from '../images/success.svg';
import error from '../images/error.svg'
import { useLocation, useNavigate } from 'react-router-dom';

function InfoTooltip (props) {
  const location = useLocation();
  const navigate = useNavigate();
  // Переадресация на вход только после успешной регистрации и закрытии popup
  function redirectPopup () {
    if (props.status) { 
      props.onClose();
      // Проверяем адрес и переводим при корректном выполнении условия
      if (location.pathname === '/sign-up') { navigate('/sign-in', { replace: true }) }
    }
    props.onClose();
  }

  return(
    <div className={ `popup ${ props.isOpen ? 'popup_opened' : '' }` } id={ props.id }>
      <div className="popup__content">
        <button type="button" className="popup-close" onClick={ redirectPopup } aria-label="Закрыть форму" />
        <div className="auth__info">
          { props.status ? (
            <>
              <img src={ success } className="auth__status-icon" alt="Иконка успеха" />
              <p className="auth__status-text">Вы успешно зарегистрировались!</p>
            </>
          ) : (
            <>
              <img src={ error } className="auth__status-icon" alt="Иконка ошибки" />
              <p className="auth__status-text">Что-то пошло не так! Попробуйте ещё раз.</p>
            </>
          ) }
        </div>
      </div>
    </div>
  )
}

export default InfoTooltip;