import { NavLink } from 'react-router-dom';
import React, { memo, useCallback, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import * as Actions from '../../redux/project/actions';
import { LeftPanelProps } from '../LeftPanel/LeftPanel';
import Button from '../UI/Button';
import Icon from '../UI/Icon';
import Modal from '../UI/Modal';
import { EditorProps } from '../../containers/EditorLogic';
import { selectCurrentProject } from '../../redux/project/selectors';
import { AppReduxState } from '../../shared/types/app';
import { selectUserData } from '../../redux/user/selectors';
import { IMAGES } from '../../constants/images';
import { PATH_NAMES } from '../../constants/pathNames';
import { logout } from '../../redux/user/actions';
import { openSignScreen } from '../../utils/history';

const styles = require('./TopPanel.scss');

const mapStateToProps = (state: AppReduxState) => ({
  project: selectCurrentProject(state),
});

const mapDispatchToProps = {
  renameProject: Actions.renameProject,
};

type TTopPanelProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    pathname: string;
    isLPanelMinimized: LeftPanelProps['isLPanelMinimized'];
    project: EditorProps['currentProject'];
    onMinimiserLPanel(): void;
    renameProject: typeof Actions.renameProject;
  };

const TopPanel: React.FunctionComponent<TTopPanelProps> = ({
  project = { name: '', id: -1 },
  pathname,
  isLPanelMinimized,
  onMinimiserLPanel,
  renameProject,
}) => {
  const dispatch = useDispatch();
  const { avatar, username } = useSelector(selectUserData);

  const [newProjectName, setNewProjectName] = useState('');
  const [modalRenameProjectOpen, setModalRenameProjectOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (ev: React.MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(ev.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    dispatch(logout());
    openSignScreen('signin');
  };

  const closeModal = useCallback(() => {
    setNewProjectName(project.name);
    setModalRenameProjectOpen(false);
  }, [project.name]);

  const handleRenameProject = useCallback(() => {
    setNewProjectName(project.name);
    setModalRenameProjectOpen(true);
  }, [project.name]);

  const onRenameProject = useCallback(
    (event) => {
      event.preventDefault();
      renameProject(project.id, newProjectName);
      closeModal();
    },
    [project, newProjectName, renameProject, closeModal],
  );

  const handleNewProjectName = useCallback(({ target: { value } }) => {
    setNewProjectName(value);
  }, []);

  return (
    <header
      className={classNames(
        styles.topPanel,
        isLPanelMinimized && styles.topPanel_minimize,
      )}
    >
      <div className={styles.topPanelLeftBlock}>
        <Button
          className={styles.topPanelBtn}
          styleType="confirm"
          onClick={onMinimiserLPanel}
        >
          <Icon icon="menu" size={20} />
        </Button>
      </div>

      {pathname !== '/projects' && (
        <div className={styles.topPanelCenterBlock}>
          <p className={styles.topPanelProjectTitle}>{project.name}</p>

          <Button
            className={classNames('mainImgBtn', styles.editProjectBtn)}
            styleType="none"
            onClick={handleRenameProject}
          >
            <Icon icon="edit" size={20} />
          </Button>
        </div>
      )}

      <div className={styles.topPanelRightBlock}>
        <IconButton size="small" onClick={handleAvatarClick}>
          <Avatar alt={username} src={avatar || IMAGES.prof} />
        </IconButton>

        <Menu
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorEl={menuAnchorEl}
          keepMounted
          className={styles.menu}
        >
          <NavLink to={PATH_NAMES.profile} exact className={styles.navLink}>
            <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
          </NavLink>

          <NavLink to={PATH_NAMES.projects} exact className={styles.navLink}>
            <MenuItem onClick={handleMenuClose}>My Projects</MenuItem>
          </NavLink>

          <Divider />

          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </div>

      {modalRenameProjectOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Rename project"
          confirmText="Rename"
          onConfirm={(event) => onRenameProject(event)}
          cancelText="Close"
          onClose={closeModal}
        >
          <div className={styles.modalBody}>
            <input
              type="text"
              className={styles.screenName}
              value={newProjectName}
              placeholder="New project name"
              onChange={handleNewProjectName}
            />
          </div>
        </Modal>
      )}
    </header>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(TopPanel));
