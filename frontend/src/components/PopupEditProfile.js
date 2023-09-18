/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';

function PopupEditProfile (props) {
    // Подписка на контекст
    const userItem = useContext(CurrentUserContext);
    
    // Стейты для пользователя
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Эффект заполнения данными при открытии формы
    useEffect( () => { setName(userItem.name); setDescription(userItem.about) }, [ props.isOpen ]);

    function handleSubmit (event) {
      event.preventDefault();
      props.onUpdateUser( { name: name, about: description } );
    }
    function handleName (event) { setName(event.target.value) }
    function handleDescription (event) { setDescription(event.target.value) }
  return (
    <PopupWithForm
      isOpen = { props.isOpen }
      onClose = { props.onClose }
      onSubmit = { handleSubmit }
      className = 'popup-author'
      title = 'Редактировать профиль'
      type = 'profile' >
        <label className="form-field">
          <input id="author" type="text" className="popup-text popup-text_author"
                 name="username" value={ name || '' } onChange={ handleName } required placeholder="Имя" minLength="2" maxLength="40" />
          <span className="popup-form__input-error author-input-error" />
        </label>
        <label className="form-field">
          <input id="descr" type="text" className="popup-text popup-text_descr"
                 name="description" value={ description || '' } onChange={ handleDescription } required placeholder="Описание" minLength="2" maxLength="200" />
          <span className="popup-form__input-error descr-input-error" />
        </label>
    </PopupWithForm>
  )
}

export default PopupEditProfile;