import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from 'components/Modal/Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ url, onCloseModal }) {
  useEffect(() => {
    const handleKeyDown = evt => {
      if (evt.code === 'Escape') {
        onCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseModal]);

  const handleBackdropClick = evt => {
    evt.target === evt.currentTarget && onCloseModal();
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <img src={url} alt="" />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};
