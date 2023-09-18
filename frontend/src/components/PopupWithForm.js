import React from 'react';

function PopupWithForm (props) {
  return (
    <div className={ `popup ${ props.isOpen ? 'popup_opened' : '' }` } id={ props.id }>
      <div className="popup__content">
        <button type="button" className="popup-close" onClick={ props.onClose } name="close" aria-label="Закрыть форму"></button>
        <form className="popup-form" name={ props.type } onSubmit={ props.onSubmit }>
          <h2 className="popup-title">{ props.title }</h2>
          { props.children }
          <button type="submit" className="btn-save" name="subject"  aria-label="Сохранить">{ props.buttonText || 'Сохранить' }</button>
        </form>
       </div>
    </div>
  )
  
}

export default PopupWithForm;