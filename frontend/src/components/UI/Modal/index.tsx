import React, { memo, useCallback } from 'react';
import classNames from 'classnames';

import Button from '$components/UI/Button';
import Icon from '$components/UI/Icon';

const styles = require('./styles.scss');

interface IModalProps {
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children?: any;
  confirmDisabled?: boolean;
  animClassName?: string;
  bodyClassName?: string;
}

const Modal: React.FC<IModalProps> = ({
  title,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  confirmDisabled,
  children,
  animClassName,
  bodyClassName,
}) => {
  const handleCloseModal = useCallback(
    (event) => {
      event.preventDefault();

      onClose();
    },
    [onClose],
  );

  const onModalWrapperClick = useCallback(
    (event) => {
      const modal = event.target.closest('form');

      if (modal) {
        return;
      }

      handleCloseModal(event);
    },
    [handleCloseModal],
  );

  const handleConfirm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onConfirm?.(event);
    },
    [onConfirm],
  );

  return (
    <div
      className={classNames(styles.modalWrapper)}
      onClick={onModalWrapperClick}
    >
      <form
        className={classNames(
          styles.modalContainer,
          'brakeAnimation',
          animClassName,
        )}
        onSubmit={handleConfirm}
      >
        <Button
          styleType="none"
          className={styles.modalCloseButton}
          onClick={handleCloseModal}
        >
          <Icon icon="close" size={20} />
        </Button>
        {title !== '' && <p className={styles.modalTitle}>{title}</p>}
        <div className={classNames(styles.modalBody, bodyClassName)}>
          {children}
        </div>
        <div className={styles.modalActions}>
          {cancelText && (
            <Button styleType="secondary" onClick={handleCloseModal}>
              {cancelText}
            </Button>
          )}
          {confirmText && onConfirm && (
            <Button
              type={cancelText ? 'submit' : 'confirm'}
              disabled={!!confirmDisabled}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default memo(Modal);
