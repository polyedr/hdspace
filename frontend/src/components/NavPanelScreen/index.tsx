import React, { useCallback, memo } from 'react';
import classNames from 'classnames';
import Sortable from 'react-sortablejs'; // maybe replace it with react-sortablejs-typescript?
import { NavLink } from 'react-router-dom';

import { IProject, IProjectScreen, IProjectListItem } from '$redux/project/types';
import { Modal } from '$components/UI/Modal';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import * as Actions from '$redux/project/actions';
import { EditorProps } from '$containers/EditorLogic';
import { uniqueId } from '$utils/NumberHelper';

const styles = require('./styles.scss');

interface INavPanelScreenProps {
  screenID?: string;
  isNavPanelMinimized: EditorProps['isNavPanelMinimized'];
  onMinimizerNavPanel(): void;
  projectID: number;
  project: IProject;
  screen: IProjectScreen;
  getProject: typeof Actions.getProject;
  setProjectScreens: typeof Actions.setProjectScreens;
  activateScreen: typeof Actions.activateScreen;
  addScreen: typeof Actions.addScreen;
  delScreen: typeof Actions.delScreen;
  renameScreen: typeof Actions.renameScreen;
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
  setProjectScreens,
  addScreen,
  delScreen,
  renameScreen,
}) => {
  const [modalRenameScreenOpen, setModalRenameScreenOpen] = React.useState<boolean>(false);
  const [changeScreen, setChangeScreen] = React.useState({ id: -1, name: '' });
  const [newScreenName, setNewScreenName] = React.useState<string>('');
  const [modalMsgDanger, setModalMsgDanger] = React.useState<string>('');
  const [modalDellScreen, setModalDellScreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    getProject(projectID, screenID);
  }, [projectID, getProject]);

  const openScreen = useCallback((id: number) => {
    if (id === screen.id) return;

    activateScreen(projectID, id);
  }, [screen, projectID, activateScreen]);

  const changeNewScreenName = useCallback((e) => {
    setNewScreenName(e.target.value);
    setModalMsgDanger('');
  }, []);

  const cancelModal = useCallback(() => {
    setModalMsgDanger('');
    setModalRenameScreenOpen(false);
    setModalDellScreen(false);
  }, []);

  const handleScreenAdd = useCallback(() => {
    addScreen(projectID, 'Screen');
  }, [projectID]);

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
    renameScreen(projectID, changeScreen.id, newScreenName);
  }, [cancelModal, newScreenName, changeScreen, projectID, renameScreen]);

  const onDelScreen = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    cancelModal();
    delScreen(projectID, changeScreen.id);
  }, [cancelModal, changeScreen, projectID, delScreen]);

  const handleChange = useCallback((order: string[]) => {
    const newProjectScreens = order.reduce((acc: IProjectListItem[], currScreenID, currScreenIndex) => {
      const currentProjectScreen = project.projectscreen.find(currentScreen => (
        Number(currScreenID) === currentScreen.id
      ));

      return currentProjectScreen ? 
        acc.concat(
          {
          ...currentProjectScreen,
          buoyancy: project.projectscreen.length - currScreenIndex,
        }) : acc;
    }, []);

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
            className={styles.screensTabsContainer}
            onChange={handleChange}
          >
            {
              project.projectscreen.map(s => (
                <NavLink
                  key={s.id}
                  to={`/project/${projectID}/${s.id}`}
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
});

export default NavPanelScreen;
