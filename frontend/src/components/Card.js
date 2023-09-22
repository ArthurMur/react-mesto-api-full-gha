import React, { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card (props) {
  // Подписка на контекст
  const userItem = useContext(CurrentUserContext);

  // Определяем владельца карточкой
  const isOwn = props.card.owner.toString() === userItem._id;

  // Определяем наличие поставленного лайка
  const isLiked = props.card.likes.some(item => item._id === userItem._id);

  function handleClick () { props.onCardClick(props.card) }
  function handleDelete () { props.onCardDelete(props.card) }
  function handleLike () { props.onCardLike(props.card) }

  return (
    <div className="elements__item">
      { isOwn && <button type="button" className='btn-delete' onClick={ handleDelete } aria-label="Удалить" /> }
      <img src={props.link} className="elements__img" onClick={ handleClick } alt={ props.name }/>
      <div className="elements-descr">
        <h2 className="elements__text">{ props.name }</h2>        
        <div className="elements-like_info">        
          <button type="button" className={ `btn-heart ${ isLiked ? 'btn-heart_active' : '' }` } onClick={ handleLike } name="like"></button>
          <p className="btn-heart-counter">{ props.likeCount > 0 ? props.likeCount : null }</p>
        </div>
      </div>
    </div>
  )
}

export default Card;