import React, { ChangeEvent, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { IProjectScreen } from '$redux/project/types';
import { selectCurrentScreen } from '$redux/project/selectors';
import {
  activateScreen,
  delScreen,
  duplicateScreen,
  renameScreen,
} from '$redux/project/actions';
import { Modal } from '$components/UI/Modal';

const styles = require('./NavPanelScreen.scss');

type Props = {
  screen: IProjectScreen;
  screens: IProjectScreen[];
};

const ScreenButton: React.FC<Props> = ({
  screens,
  screen: { id, project, name, image },
}) => {
  const dispatch = useDispatch();
  const currentScreen = useSelector(selectCurrentScreen);

  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name);

  const handleDelScreen = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(delScreen(project, id));
  };

  const handleEditButtonClick = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    setRenameOpen(true);
  };

  const closeModal = () => {
    setRenameOpen(false);
  };

  const handleScreenNameInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setNewName(ev.target.value);
  };

  const handleRenameModalConfirm = (ev: FormEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (newName === name) return;

    dispatch(renameScreen(project, id, newName));
    closeModal();
  };

  const openScreen = () => {
    if (id === currentScreen.id) return;
    dispatch(activateScreen(id));
  };

  const handleDuplicateScreen = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(duplicateScreen(name, id));
  };

  return (
    <>
      <NavLink
        to={`/project/${project}/${id}`}
        className={classNames(
          styles.screenContainer,
          currentScreen && id === currentScreen.id
            ? styles.screenContainer_active
            : '',
        )}
        data-id={id}
      >
        <div className={styles.screenNavigate} onClick={openScreen}>
          <Button
            className="propsPanelImgBtn"
            styleType="none"
            onClick={handleEditButtonClick}
          >
            <Icon icon="edit" size={20} />
          </Button>

          <Button
            className="propsPanelImgBtn"
            styleType="none"
            onClick={handleDuplicateScreen}
          >
            <Icon icon="copy" size={20} />
          </Button>

          {screens.length > 1 && (
            <Button
              className="delBtn"
              styleType="none"
              onClick={handleDelScreen}
            >
              <Icon icon="delete" size={20} />
            </Button>
          )}
        </div>

        <div className={classNames(styles.screenTab)}>
          {image ? <img src={image} alt="img" /> : <span>{name}</span>}
        </div>
      </NavLink>

      {renameOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Rename screen"
          confirmText="Rename"
          onConfirm={handleRenameModalConfirm}
          cancelText="Close"
          onClose={closeModal}
        >
          <div className={styles.modalBody}>
            <input
              type="text"
              className="modalTextInput"
              value={newName}
              placeholder="New screen name"
              onChange={handleScreenNameInputChange}
              required
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ScreenButton;
