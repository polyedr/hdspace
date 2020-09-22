import { NavLink } from 'react-router-dom';
import React, { memo, useCallback, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import * as Actions from '../../redux/project/actions';
import Button from '../UI/Button';
import Icon from '../UI/Icon';
import Modal from '../UI/Modal';
import { selectCurrentProject } from '../../redux/project/selectors';
import { AppReduxState } from '../../shared/types/app';
import {
  selectIsLeftPanelMinimized,
  selectUserData,
} from '../../redux/user/selectors';
import { IMAGES } from '../../constants/images';
import { PATH_NAMES } from '../../constants/pathNames';
import { changeMinLPanel, logout } from '../../redux/user/actions';
import { openSignScreen } from '../../utils/history';
import { Project } from '../../api/types';

const styles = require('./TopPanel.scss');

const mapStateToProps = (state: AppReduxState) => ({
  project: selectCurrentProject(state),
});

const mapDispatchToProps = {
  renameProject: Actions.renameProject,
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    project: Project;
  };

const TopPanel: React.FC<Props> = ({
  project = { name: '', id: -1 },
  renameProject,
}) => {
  const dispatch = useDispatch();
  const { avatar, username } = useSelector(selectUserData);
  const pathname = useSelector(
    (state: AppReduxState) => state.router.location.pathname,
  );
  const isLPanelMinimized = useSelector(selectIsLeftPanelMinimized);

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

  const toggleLeftPanel = () => dispatch(changeMinLPanel());

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
          onClick={toggleLeftPanel}
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
        <Tooltip title={username} arrow enterDelay={500}>
          <IconButton size="small" onClick={handleAvatarClick}>
            <Avatar alt={username} src={avatar || IMAGES.prof} />
          </IconButton>
        </Tooltip>

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
