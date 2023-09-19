import logoPath from '../images/logo-white.svg';
import { Link, Route, Routes } from 'react-router-dom';

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logoPath} alt="логотип место"/>
      <div className="header__member-area">
        { props.isLoggedIn ? ( // Если пользователь авторизован, то он увидит этот код:
          <>
            <p className="header__menu-item">{ props.email }</p>
            < Link to='/signin' className="header__menu-item" onClick={ props.isLogout }>Выйти</Link>
          </>
        ) : ( // Если пользователь не авторизован, то вот этот код:
          <Routes>
          <Route path='/signup' element={
            <Link to='/signin' className="header__menu-item">Войти</Link>
          }/>
            <Route  path='/signin' element={
              <Link to='/signup' className="header__menu-item">Регистрация</Link>
            } />
          </Routes>
        )} 
      </div>
    </header>
  )
}

export default Header;