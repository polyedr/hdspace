import React, { useCallback } from 'react';
import classNames from 'classnames';
import Sortable from 'react-sortablejs';

import { IProject, IProjectScreen } from '$redux/project/reducer';
import { Modal } from '$components/UI/Modal';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import * as Actions from '$redux/project/actions';
import { IEditorProps } from '$containers/EditorLogic';
import { uniqueId } from '$utils/NumberHelper';

const styles = require('./styles.scss');

interface INavPanelScreenProps {
  isNavPanelMinimized: IEditorProps['isNavPanelMinimized'],
  onMinimizerNavPanel(): void,
  projectId: number,
  project: IProject,
  screen: IProjectScreen,
  getProject: typeof Actions.getProject,
  setProjectScreens: typeof Actions.setProjectScreens,
  activateScreen: typeof Actions.activateScreen,
  addScreen: typeof Actions.addScreen,
  delScreen: typeof Actions.delScreen,
  renameScreen: typeof Actions.renameScreen,
}

const NavPanelScreen: React.FunctionComponent<INavPanelScreenProps> = ({
  isNavPanelMinimized,
  onMinimizerNavPanel,
  projectId,
  project,
  screen,

  activateScreen,
  getProject,
  setProjectScreens,
  addScreen,
  delScreen,
  renameScreen,
}) => {
  const [screenName, setScreenName] = React.useState<string>('');
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalRenameScreenOpen, setModalRenameScreenOpen] = React.useState<boolean>(false);
  const [changeScreen, setChangeScreen] = React.useState({ id: -1, name: '' });
  const [newScreenName, setNewScreenName] = React.useState<string>('');
  const [modalMsgDanger, setModalMsgDanger] = React.useState<string>('');
  const [modalDellScreen, setModalDellScreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    getProject(projectId);
  }, [projectId, getProject]);

  const openScreen = useCallback((id: number) => {
    if (id === screen.id) return;

    activateScreen(projectId, id);
  }, [screen, projectId, activateScreen]);

  const changeScreenName = useCallback((e) => {
    setScreenName(e.target.value);
    setModalMsgDanger('');
  }, []);

  const changeNewScreenName = useCallback((e) => {
    setNewScreenName(e.target.value);
    setModalMsgDanger('');
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const cancelModal = useCallback(() => {
    setScreenName('');
    setModalMsgDanger('');
    setModalOpen(false);
    setModalRenameScreenOpen(false);
    setModalDellScreen(false);
  }, []);

  const handleAddScreen = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (screenName.trim() === '') {
      setModalMsgDanger('Name not specified');
    } else {
      addScreen(projectId, screenName);
      cancelModal();
    }
  }, [screenName, projectId, addScreen, cancelModal]);

  const handleRenameScreen = useCallback((e, id: number, name: string) => {
    e.preventDefault();
    e.stopPropagation();

    setChangeScreen({ id, name });
    setNewScreenName(name);
    setModalRenameScreenOpen(true);
  }, []);

  const handleDelScreen = useCallback((e, id: number, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setChangeScreen({ id, name });
    setModalDellScreen(true);
  }, []);

  const onRenameScreen = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    cancelModal();
    renameScreen(projectId, changeScreen.id, newScreenName);
  }, [cancelModal, newScreenName, changeScreen, projectId, renameScreen]);

  const onDelScreen = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    cancelModal();
    delScreen(projectId, changeScreen.id);
  }, [cancelModal, changeScreen, projectId, delScreen]);

  const handleChange = useCallback((order) => {
    const newProjectScreens = order.map((currnetScreenId, index) => {
      const currentProjectScreen = project.projectscreen.find(currentScreen => (
        Number(currnetScreenId) === currentScreen.id
      ));

      return (
        {
          ...currentProjectScreen,
          buoyancy: project.projectscreen.length - index,
        }
      );
    });

    setProjectScreens(newProjectScreens);
  }, [project, setProjectScreens]);

  return (
    <div
      className={classNames(
        styles.navPanelContainer,
        isNavPanelMinimized && styles.navPanelContainer_minimize,
      )}
    >
      <div className={styles.navPanelBlock}>
        <Button
          className={classNames('expandBtn', styles.navPanelExpandBtn)}
          styleType="none"
          onClick={onMinimizerNavPanel}
        >
          <Icon icon="expand" size={28} />
        </Button>
        <div className={styles.screensBlock}>
          <Sortable
            key={uniqueId()}
            className={styles.screensTabsContainer}
            onChange={handleChange}
          >
            {
              project.projectscreen.map(s => (
                <div
                  key={s.id}
                  className={classNames(styles.screenContainer, screen && s.id === screen.id ? styles.screenContainer_active : '')}
                  data-id={s.id}
                >
                  <div
                    className={styles.screenNavigate}
                    onClick={() => openScreen(s.id)}
                  >
                    <Button
                      className="propsPanelImgBtn"
                      styleType="none"
                      onClick={e => handleRenameScreen(e, s.id, s.name)}
                    >
                      <Icon icon="edit" size={20} />
                    </Button>
                    <Button
                      className="delBtn"
                      styleType="none"
                      onClick={e => handleDelScreen(e, s.id, s.name)}
                    >
                      <Icon icon="delete" size={20} />
                    </Button>
                  </div>
                  <div
                    className={classNames(
                      styles.screenTab,
                    )}
                  >
                    { s.image ? (
                      <img
                        src={s.image}
                        alt="img"
                        style={{
                          position: 'absolute',
                          width: '100%',
                          maxHeight: '100%',
                          objectFit: 'cover',
                          objectPosition: '0 0',
                        }}
                      />
                    ) : (
                      <span>{s.name}</span>
                    )}
                  </div>
                </div>
              ))
            }
          </Sortable>
          <Button
            className={classNames(styles.addScreenBtn)}
            styleType="confirm"
            onClick={openModal}
          >
            <Icon icon="add" size={16} />
          </Button>
        </div>
      </div>
      {modalOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Add Screen"
          confirmText="Add"
          onConfirm={handleAddScreen}
          cancelText="Close"
          onClose={cancelModal}
        >
          <div className={styles.modalBody}>
            <input
              type="text"
              className={styles.screenName}
              value={screenName}
              placeholder="Screen name"
              onChange={changeScreenName}
              autoFocus
            />
            {modalMsgDanger && <p>{modalMsgDanger}</p>
            }
          </div>
        </Modal>
      )}
      {modalRenameScreenOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Rename screen"
          confirmText="Rename"
          onConfirm={e => onRenameScreen(e)}
          cancelText="Close"
          onClose={cancelModal}
        >
          <div className={styles.modalBody}>
            <input
              type="text"
              className="modalTextInput"
              value={newScreenName}
              placeholder="New screen name"
              onChange={changeNewScreenName}
              required
            />
            {modalMsgDanger && <p>{modalMsgDanger}</p>
            }
          </div>
        </Modal>
      )}
      {modalDellScreen && (
        <Modal
          animClassName="bubbleAnimation"
          title=""
          confirmText="Delete"
          onConfirm={e => onDelScreen(e)}
          cancelText="Close"
          onClose={cancelModal}
        >
          <div className={styles.modalBody}>
            {`Delete Screen: ${changeScreen.name}`}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NavPanelScreen;
