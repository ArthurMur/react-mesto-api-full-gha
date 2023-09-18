import React, { useContext } from 'react';
import plusPath from '../images/plus.svg';
import Card from './Card';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Main(props) {
    // Подписка на контекст
    const userItem = useContext(CurrentUserContext);
    
  return (
    <main className="main">
      <section className="profile" aria-label="секция профиля">
        <button className="profile__avatar-edit" onClick={props.onEditAvatar}></button>
        <img className="profile__avatar" src={userItem.avatar} name="avatar" alt="аватар"/>
        <div className="profile__info">
          <div className="profile__item">
            <h1 className="profile__author">{userItem.name}</h1>
            <button type="button" className="btn-edit" onClick={props.onEditProfile}></button>
          </div>
          <h2 className="profile__descr">{userItem.about}</h2>
        </div>
        <button type="button" className="btn-add" onClick={props.onAddPlace}><img src={plusPath} className="btn-add-img" alt="изображение кнопки добавления картчоки"/></button>
      </section>
      <section className="elements" aria-label="секция карточек">
      { props.cards.map( (cardItem) => (
          < Card
            key = { cardItem._id }
            link = { cardItem.link }
            name = { cardItem.name }
            likeCount = { cardItem.likes.length }
            onCardClick = { props.onCardClick }
            onCardDelete = { props.onCardDelete }
            onCardLike = { props.onCardLike }
            card = { cardItem } />
        )) }
      </section>
    </main>
  )
}

export default Main;