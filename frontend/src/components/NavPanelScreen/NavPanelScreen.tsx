import React, { useCallback, memo, useEffect } from 'react';
import classNames from 'classnames';
import Sortable from 'react-sortablejs'; // maybe replace it with react-sortablejs-typescript?
import { NavLink } from 'react-router-dom';

import { IProjectScreen } from '$redux/project/types';
import { Modal } from '$components/UI/Modal';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import * as Actions from '$redux/project/actions';
import { EditorProps } from '$containers/EditorLogic';
import { Project } from '$api/types';
import { Scrollbar } from '$components/UI/Scrollbar';

const styles = require('./NavPanelScreen.scss');

interface INavPanelScreenProps {
  screenID?: string;
  isNavPanelMinimized: EditorProps['isNavPanelMinimized'];
  onMinimizerNavPanel(): void;
  projectID: number;
  project: Project;
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
  id: number;
  name: string;
};

const NavPanelScreen: React.FunctionComponent<INavPanelScreenProps> = memo(
  ({
    isNavPanelMinimized,
    onMinimizerNavPanel,
    projectID,
    screen: currentScreen,
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
    const [modalRenameScreenOpen, setModalRenameScreenOpen] = React.useState<
      boolean
    >(false);
    const [editableScreen, setEditableScreen] = React.useState<Screen>({
      id: -1,
      name: '',
    });
    const [screens, setScreens] = React.useState<IProjectScreen[]>(
      projectScreens,
    );
    const [modalMsgDanger, setModalMsgDanger] = React.useState<string>('');

    useEffect(() => {
      getProject(projectID, screenID);
    }, [projectID, getProject]);

    useEffect(() => {
      const orderedScreens = [...projectScreens].sort(
        (a, b) => a.buoyancy - b.buoyancy,
      );

      setScreens(orderedScreens);
    }, [projectScreens]);

    const openScreen = useCallback(
      (id: number) => {
        if (id === currentScreen.id) return;

        activateScreen(projectID, id);
      },
      [currentScreen, projectID, activateScreen],
    );

    const handleScreenNameInputChange = useCallback(
      (e) => {
        const changedScreen = { ...editableScreen, name: e.target.value };
        setEditableScreen(changedScreen);
        setModalMsgDanger('');
      },
      [editableScreen],
    );

    const cancelModal = useCallback(() => {
      setModalMsgDanger('');
      setModalRenameScreenOpen(false);
    }, []);

    const handleScreenAdd = useCallback(() => {
      addScreen(projectID, `Screen 1`, screens.length);
    }, [projectID, screens]);

    const handleEditButtonClick = useCallback(
      (e, id: number) => {
        e.preventDefault();
        e.stopPropagation();

        const changedScreen = screens.find((screen) => screen.id === id);

        if (changedScreen) {
          setEditableScreen(changedScreen);
        }
        setModalRenameScreenOpen(true);
      },
      [screens],
    );

    const handleDuplicateScreen = useCallback(
      (event, id: number) => {
        event.preventDefault();
        event.stopPropagation();

        const changedScreen = screens.find((screen) => screen.id === id);
        if (changedScreen) {
          setEditableScreen(changedScreen);
        }

        duplicateScreen(changedScreen?.name || 'copy', changedScreen?.id || -1);
      },
      [screens],
    );

    const handleDelScreen = (e: Event, id: number) => {
      e.preventDefault();
      e.stopPropagation();
      delScreen(projectID, id);
    };

    const handleRenameModalConfirm = useCallback(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        cancelModal();

        renameScreen(projectID, editableScreen.id, editableScreen.name);

        const newScreens = screens.map((screen) =>
          screen.id === editableScreen.id
            ? { ...screen, name: editableScreen.name }
            : screen,
        );
        setScreens(newScreens);
      },
      [cancelModal, editableScreen, screens, projectID, renameScreen],
    );

    const handleChange = useCallback(
      (order: string[]) => {
        const newScreens = [...screens].map((screen) => {
          const newBuoyancy = order.indexOf(String(screen.id));
          return { ...screen, buoyancy: newBuoyancy };
        });

        changeScreensOrder(newScreens);
      },
      [changeScreensOrder, screens],
    );

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
            <Button
              className={classNames(styles.addScreenBtn)}
              styleType="confirm"
              onClick={handleScreenAdd}
            >
              <Icon icon="add" size={16} />
            </Button>

            <Scrollbar autoHeightMin={isNavPanelMinimized ? '38px' : '110px'}>
              <Sortable
                className={styles.screensTabsContainer}
                onChange={handleChange}
              >
                {screens.map((screenItem) => (
                  <NavLink
                    key={screenItem.id}
                    to={`/project/${projectID}/${screenItem.id}`}
                    className={classNames(
                      styles.screenContainer,
                      currentScreen && screenItem.id === currentScreen.id
                        ? styles.screenContainer_active
                        : '',
                    )}
                    data-id={screenItem.id}
                  >
                    <div
                      className={styles.screenNavigate}
                      onClick={() => openScreen(screenItem.id)}
                    >
                      <Button
                        className="propsPanelImgBtn"
                        styleType="none"
                        onClick={(e) => handleEditButtonClick(e, screenItem.id)}
                      >
                        <Icon icon="edit" size={20} />
                      </Button>
                      <Button
                        className="propsPanelImgBtn"
                        styleType="none"
                        onClick={(e) => handleDuplicateScreen(e, screenItem.id)}
                      >
                        <Icon icon="copy" size={20} />
                      </Button>
                      {screens.length > 1 && (
                        <Button
                          className="delBtn"
                          styleType="none"
                          onClick={(e) => handleDelScreen(e, screenItem.id)}
                        >
                          <Icon icon="delete" size={20} />
                        </Button>
                      )}
                    </div>
                    <div className={classNames(styles.screenTab)}>
                      <span>{screenItem.name}</span>
                    </div>
                  </NavLink>
                ))}
              </Sortable>
            </Scrollbar>
          </div>
        </div>

        {modalRenameScreenOpen && (
          <Modal
            animClassName="bubbleAnimation"
            title="Rename screen"
            confirmText="Rename"
            onConfirm={(e) => handleRenameModalConfirm(e)}
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
              {modalMsgDanger && <p>{modalMsgDanger}</p>}
            </div>
          </Modal>
        )}
      </div>
    );
  },
);

export default NavPanelScreen;
