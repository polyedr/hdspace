import React, { useCallback, memo, useEffect } from 'react';
import classNames from 'classnames';
import Sortable from 'react-sortablejs'; // maybe replace it with react-sortablejs-typescript?
import { NavLink } from 'react-router-dom';

import { IProject, IProjectScreen } from '$redux/project/types';
import { Modal } from '$components/UI/Modal';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import * as Actions from '$redux/project/actions';
import { EditorProps } from '$containers/EditorLogic';

const styles = require('./NavPanelScreen.scss');

interface INavPanelScreenProps {
  screenID?: string;
  isNavPanelMinimized: EditorProps['isNavPanelMinimized'];
  onMinimizerNavPanel(): void;
  projectID: number;
  project: IProject;
  screen: IProjectScreen;
  getProject: typeof Actions.getProject;
  changeScreensOrder: typeof Actions.changeScreensOrder;
  activateScreen: typeof Actions.activateScreen;
  addScreen: typeof Actions.addScreen;
  duplicateScreen: typeof Actions.duplicateScreen;
  delScreen: typeof Actions.delScreen;
  renameScreen: typeof Actions.renameScreen;
  projectScreens: IProjectScreen[];
}

type Screen = {
  id: number, 
  name: string,
}

const NavPanelScreen: React.FunctionComponent<INavPanelScreenProps> = memo(({
  isNavPanelMinimized,
  onMinimizerNavPanel,
  projectID,
  project,
  screen,
  screenID,

  activateScreen,
  getProject,
  changeScreensOrder,
  addScreen,
  duplicateScreen,
  delScreen,
  renameScreen,
  projectScreens,
}) => {
  const [modalRenameScreenOpen, setModalRenameScreenOpen] = React.useState<boolean>(false);
  const [editableScreen, setEditableScreen] = React.useState<Screen>({ id: -1, name: '' });
  const [screens, setScreens] = React.useState<Screen[]>([{ id: -1, name: '' }]);
  const [modalMsgDanger, setModalMsgDanger] = React.useState<string>('');
  const [modalDellScreen, setModalDellScreen] = React.useState<boolean>(false);

  const reverseScreens = [...project.projectscreen].reverse();

  useEffect(() => {
    getProject(projectID, screenID);
  }, [projectID, getProject]);

  useEffect(() => {
    const screens = projectScreens.map(screen => ({ id: screen.id, name: screen.name }));
    setScreens(screens);
  }, [projectScreens]);

  const openScreen = useCallback((id: number) => {
    if (id === screen.id) return;

    activateScreen(projectID, id);
  }, [screen, projectID, activateScreen]);

  const handleScreenNameInputChange = useCallback((e) => {
    const changedScreen = { ...editableScreen, name: e.target.value };
    setEditableScreen(changedScreen);
    setModalMsgDanger('');
  }, [editableScreen]);

  const cancelModal = useCallback(() => {
    setModalMsgDanger('');
    setModalRenameScreenOpen(false);
    setModalDellScreen(false);
  }, []);

  const handleScreenAdd = useCallback(() => {
    addScreen(projectID, `Screen 1`);
  }, [projectID, screens]);

  const handleEditButtonClick = useCallback((e, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    const changedScreen = screens.find(screen => screen.id === id);

    changedScreen && setEditableScreen(changedScreen);
    setModalRenameScreenOpen(true);
  }, [screens]);

  const handleDuplicateScreen = useCallback((event, id: number) => {
    event.preventDefault();
    event.stopPropagation();

    const changedScreen = screens.find(screen => screen.id === id);
    changedScreen && setEditableScreen(changedScreen);

    duplicateScreen(changedScreen?.name || 'copy', changedScreen?.id || -1);
  }, []);

  const handleDelScreen = useCallback((e, id: number, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditableScreen({ id, name });
    setModalDellScreen(true);
  }, []);

  const handleRenameModalConfirm = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    cancelModal();

    renameScreen(projectID, editableScreen.id, editableScreen.name);
    
    const newScreens = screens.map(screen => screen.id === editableScreen.id ? { ...screen, name: editableScreen.name } : screen);
    setScreens(newScreens);
  }, [cancelModal, editableScreen, screens, projectID, renameScreen]);

  const onDelScreen = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    cancelModal();
    delScreen(projectID, editableScreen.id);
  }, [cancelModal, editableScreen, projectID, delScreen]);

  const handleChange = useCallback((order: string[]) => {
    changeScreensOrder(order.map(Number));
  }, [project, changeScreensOrder]);

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
            className={styles.screensTabsContainer}
            onChange={handleChange}
          >
            {
              reverseScreens.map(sID => (
                <NavLink
                  key={sID}
                  to={`/project/${projectID}/${sID}`}
                  className={classNames(styles.screenContainer, screen && sID === screen.id ? styles.screenContainer_active : '')}
                  data-id={sID}
                  >
                    <div
                      className={styles.screenNavigate}
                      onClick={() => openScreen(sID)}
                    >
                      <Button
                        className="propsPanelImgBtn"
                        styleType="none"
                        onClick={e => handleEditButtonClick(e, sID)}
                      >
                        <Icon icon="edit" size={20} />
                      </Button>
                      <Button
                        className="propsPanelImgBtn"
                        styleType="none"
                        onClick={e => handleDuplicateScreen(e, sID)}
                      >
                        <Icon icon="edit" size={20} />
                      </Button>
                      {screens.length > 1 && (
                        <Button
                          className="delBtn"
                          styleType="none"
                          onClick={e => handleDelScreen(e, sID, screens.find(screen => screen.id === sID)?.name!)}
                        >
                          <Icon icon="delete" size={20} />
                        </Button>
                      )}
                    </div>
                    <div
                      className={classNames(
                        styles.screenTab,
                      )}
                    >
                      <span>{screens.find(screen => screen.id === sID)?.name}</span>
                    </div>
                </NavLink>
              ))
            }
          </Sortable>
          <Button
            className={classNames(styles.addScreenBtn)}
            styleType="confirm"
            onClick={handleScreenAdd}
          >
            <Icon icon="add" size={16} />
          </Button>
        </div>
      </div>
      {modalRenameScreenOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Rename screen"
          confirmText="Rename"
          onConfirm={e => handleRenameModalConfirm(e)}
          cancelText="Close"
          onClose={cancelModal}
        >
          <div className={styles.modalBody}>
            <input
              type="text"
              className="modalTextInput"
              value={editableScreen.name}
              placeholder="New screen name"
              onChange={handleScreenNameInputChange}
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
            {`Delete Screen: ${editableScreen.name}`}
          </div>
        </Modal>
      )}
    </div>
  );
});

export default NavPanelScreen;
