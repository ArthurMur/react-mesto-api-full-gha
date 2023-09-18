import React, { useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function PopupAddCard (props) {
    // Рефы названия и картинки карточки
    const cardName = useRef();
    const cardLink = useRef();

    // Эффект для очистки полей
    useEffect( () => {
      cardName.current.value = '';
      cardLink.current.value = '';
    }, [ props.isOpen ]);
  
    function handleSubmit (event){
      event.preventDefault();
      props.onAddPlace({ name: cardName.current.value, link: cardLink.current.value });
    }
  return (
    <PopupWithForm
      isOpen = { props.isOpen }
      onClose = { props.onClose }
      onSubmit= { handleSubmit }
      id = 'cards-popup'
      title = 'Новое место'
      buttonText = 'Создать' >
        <label className="form-field">
          <input type="text" id="card-name" name="cardname" className="popup-text" ref={ cardName } placeholder="Название" required minLength="2" maxLength="30"/>
          <span className="popup-form__input-error card-name-input-error"></span>
        </label>
        <label className="form-field">
          <input type="url" id="card-source" name="cardsource" className="popup-text popup-descr" ref={ cardLink } placeholder="Ссылка на картинку" required/>
          <span className="popup-form__input-error card-source-input-error"></span>
        </label>
    </PopupWithForm>
      
    
  )
}

export default PopupAddCard;