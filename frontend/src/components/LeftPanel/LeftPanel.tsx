import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import SubjectIcon from '@material-ui/icons/Subject';
import Navigator from '../Navigator';
import Button from '../UI/Button';
import Icon from '../UI/Icon';
import Scrollbar from '../UI/Scrollbar';
import { Project } from '../../api/types';
import { setProjectList } from '../../redux/project/actions';
import { selectUserData } from '../../redux/user/selectors';
import { changeMinLPanel, logout } from '../../redux/user/actions';
import { IMAGES } from '../../constants/images';
import { openSignScreen } from '../../utils/history';
import { PATH_NAMES } from '../../constants/pathNames';
import { selectCurrentScreenId } from '../../redux/project/selectors';

const styles = require('./LeftPanel.scss');

export type LeftPanelProps = {
  pathname: string;
  projects: Project[];
  username?: string;
  isLPanelMinimized: boolean;
  setListProject: typeof setProjectList;
};

export const LeftPanel: React.FunctionComponent<LeftPanelProps> = ({
  pathname,
  projects,
  username,
  isLPanelMinimized,
}) => {
  const dispatch = useDispatch();
  const [isProjectsListActive, setIsProjectsListActive] = useState<boolean>(
    false,
  );

  const { email, avatar } = useSelector(selectUserData);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleLogoutClick = () => {
    dispatch(logout());
    openSignScreen('signin');
  };

  const openProjectsList = useCallback(() => {
    setIsProjectsListActive(!isProjectsListActive);
  }, [isProjectsListActive, setIsProjectsListActive]);

  const handleOpenLPanel = () => {
    dispatch(changeMinLPanel());
  };

  return (
    <aside
      className={cn(styles.leftPanel, isLPanelMinimized && styles.minPanel)}
    >
      <div
        className={cn(
          styles.profileBlock,
          isLPanelMinimized && styles.profileBlock_minimized,
        )}
      >
        <NavLink
          to={PATH_NAMES.profile}
          exact
          className={isLPanelMinimized ? styles.profileLink_minimized : ''}
        >
          <img
            className={styles.profileAvatar}
            src={avatar ?? IMAGES.prof}
            alt="profile"
          />
        </NavLink>

        {!isLPanelMinimized && (
          <>
            <div className={styles.profileName}>
              <span className={styles.profileText}>
                {typeof username !== 'undefined' ? username : 'Without name'}
              </span>
              <span className={styles.profileText}>{email}</span>
            </div>

            <Button onClick={handleLogoutClick} className={styles.profileBtn}>
              Log out
            </Button>
          </>
        )}
      </div>

      <nav>
        <ul className={styles.navigationList}>
          <li
            className={cn(styles.navigationItem, styles.navigationItem_column)}
          >
            <div>
              <NavLink
                className={cn(
                  styles.navigationLink,
                  pathname === PATH_NAMES.projects &&
                    styles.navigationLink_active,
                )}
                exact
                to={PATH_NAMES.projects}
                activeClassName="active"
              >
                <Icon icon="dashboard" />
                <span>My Projects</span>
              </NavLink>

              <Button
                className={cn(
                  styles.navigationExpandBtn,
                  isProjectsListActive && styles.navigationExpandBtn_active,
                )}
                styleType="none"
                onClick={openProjectsList}
              >
                <Icon icon="expand" size={30} />
              </Button>
            </div>

            <ul
              className={cn(
                styles.navigationInnerList,
                isProjectsListActive && styles.navigationInnerList_active,
              )}
            >
              <Scrollbar
                trackStylesBg="transparent"
                hideTracksWhenNotNeeded
                maxHeight={165}
              >
                {projects.map((project) => (
                  <li key={project.id} className={cn(styles.navigationItem)}>
                    <NavLink
                      className={cn(
                        styles.navigationLink,
                        styles.navigationLink_inner,
                      )}
                      exact
                      to={PATH_NAMES.projects}
                      activeClassName="active"
                    >
                      <span>{project.name}</span>
                    </NavLink>
                  </li>
                ))}
              </Scrollbar>
            </ul>
          </li>
        </ul>
      </nav>

      {currentScreenId !== -1 &&
        (isLPanelMinimized ? (
          <div
            className={styles.navigationLink}
            onClick={handleOpenLPanel}
            title="Navigator"
          >
            <SubjectIcon />
          </div>
        ) : (
          <Navigator />
        ))}
    </aside>
  );
};
