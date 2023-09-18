import React from 'react';

function ImagePopup (props) {
  return (
    <div className={`popup popup-image ${props.isOpen ? 'popup_opened' : '' }`} id={ props.id }>
          <div className="popup-image__content">
              <button type="button" className="popup-close" onClick={ props.onClose } name="close"></button>
              <img src={ props.card.link } alt={ props.card.name } className="popup-image-img"/>
              <p className="popup-image-text">{ props.card.name }</p>
          </div>
        </div>
  )
}

export default ImagePopup;