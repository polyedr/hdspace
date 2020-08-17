import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import { useDispatch, useSelector } from 'react-redux';
import { IMAGES } from '$constants/images';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import { IAppProps } from '$containers/App';
import * as PATH_NAMES from '$constants/pathNames';
import { Scrollbar } from '$components/UI/Scrollbar';
import * as ActionsProject from '$redux/project/actions';
import { openSignScreen } from '$utils/history';
import { Project } from '$api/types';
import { logout } from '$redux/user/actions';
import { selectUserData } from '$redux/user/selectors';

const styles = require('./LeftPanel.scss');

export type LeftPanelProps = {
  pathname: IAppProps['pathname'];
  projects: Project[];
  username?: string;
  isLPanelMinimized: boolean;
  setListProject: typeof ActionsProject.setListProject;
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

  const handleLogoutClick = () => {
    dispatch(logout());
    openSignScreen('signin');
  };

  const openProjectsList = useCallback(() => {
    setIsProjectsListActive(!isProjectsListActive);
  }, [isProjectsListActive, setIsProjectsListActive]);

  return (
    <aside
      className={`${styles.leftPanel} ${isLPanelMinimized && styles.minPanel}`}
    >
      <div
        className={cn(
          styles.profileBlock,
          isLPanelMinimized && styles.profileBlock_minimized,
        )}
      >
        <NavLink
          to="/profile"
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

      <nav className={styles.mainNavigation}>
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
                onClick={() => openProjectsList()}
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
                style={{
                  paddingBottom: 15,
                }}
                trackStylesBg="transparent"
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
          <li className={styles.navigationItem}>
            <NavLink
              className={styles.navigationLink}
              exact
              to="/payments"
              activeClassName="active"
            >
              <Icon icon="folder-open" />
              <span>Workflow</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
