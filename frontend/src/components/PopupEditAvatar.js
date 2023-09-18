import { useEffect, useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function PopupEditAvatar (props) {
    // Реф для аватара
    const avatarRef = useRef();
    // Эффект для очистки формы
    useEffect( () => { avatarRef.current.value = '' }, [ props.isOpen ]);
    function handleSubmit(e) {
      e.preventDefault();
      props.onUpdateAvatar({ avatar: avatarRef.current.value });
    }
  return (
    <PopupWithForm
      isOpen = { props.isOpen }
      onClose = { props.onClose }
      onSubmit = { handleSubmit }
      id = 'avatar-popup'
      title = 'Обновить аватар'
      type = 'user-avatar' >
        <label className="form-field">
          <input type="text" id="avatar" name="avatar" className="popup-text popup-text_avatar" placeholder="Введите ссылку на аватар" ref={ avatarRef } required minLength="2" maxLength="200"/>
          <span className="popup-form__input-error avatar-input-error"></span>
        </label>
    </PopupWithForm>
  )
}
export default PopupEditAvatar;