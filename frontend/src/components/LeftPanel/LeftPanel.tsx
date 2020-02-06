import React, { useLayoutEffect, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { IMAGES } from '$constants/images';
import { Icon } from '$components/UI/Icon';
import { Button } from '$components/UI/Button';
import { IAppProps } from '$containers/App';
import * as PATH_NAMES from '$constants/pathNames';
import { IListProject } from '$redux/project/types';
import { Scrollbar } from '$components/UI/Scrollbar';
import * as Actions from '$redux/user/actions';
import * as ActionsProject from '$redux/project/actions';
import { openSignScreen } from '$utils/history';
import { DEFAULT_AUTHORISATION_TOKEN } from '$constants/defaultParams';
import { ITokenPair } from '$redux/user/reducer';

const styles = require('./LeftPanel.scss');

export interface ILeftPanel {
  pathname: IAppProps['pathname'],
  getListProject: IAppProps['getListProject']
  projects: IListProject[],
  username?: string,
  userType: string,
  tokenPair: ITokenPair,
  isLPanelMinimized: boolean,
  setListProject: typeof ActionsProject.setListProject;
  setTokenPair: typeof Actions.setTokenPair;
}

export const LeftPanel: React.FunctionComponent<ILeftPanel> = ({
  pathname,
  projects,
  username,
  userType,
  tokenPair,
  isLPanelMinimized,
  setListProject,
  getListProject,
  setTokenPair,
}) => {
  const [isProjectsListActive, setIsProjectsListActive] = useState<boolean>(false);
  const [isLoadProjectData, setIsLoadProjectData] = useState(false);

  useLayoutEffect(() => {
    if (getListProject && projects.length === 0 && !isLoadProjectData) {
      getListProject();
      setIsLoadProjectData(true);
    }
  }, [isLoadProjectData, getListProject, projects]);

  const handleLogoutClick = useCallback(() => {
    if (tokenPair.access !== '') {
      setTokenPair(DEFAULT_AUTHORISATION_TOKEN);
      setListProject([]);
      openSignScreen('signin');
    }
  }, [tokenPair, setTokenPair, setListProject]);

  const openProjectsList = useCallback(() => {
    setIsProjectsListActive(!isProjectsListActive);
  }, [isProjectsListActive, setIsProjectsListActive]);

  return (
    <aside className={`${styles.leftPanel} ${isLPanelMinimized && styles.minPanel}`}>
      {isLPanelMinimized
        ? (
          <div className={styles.logo}>
            <img src={IMAGES.logo} alt="logo" />
          </div>
        )
        : (
          <div className={styles.profileBlock}>
            <img
              className={styles.profileAvatar}
              src={IMAGES.prof}
              alt="profile"
            />
            <div className={styles.profileName}>
              <span className={styles.profileText}>
                {typeof username !== 'undefined' ? username : 'Without name'}
              </span>
              <span className={styles.profileText}>{userType}</span>
            </div>
            <Button
              onClick={handleLogoutClick}
              className={styles.profileBtn}
            >
              Log out
            </Button>
          </div>
        )
      }
      <nav className={styles.mainNavigation}>
        <ul className={styles.navigationList}>
          <li className={classNames(styles.navigationItem, styles.navigationItem_column)}>
            <div>
              <NavLink
                className={classNames(
                  styles.navigationLink,
                  pathname === PATH_NAMES.projects && styles.navigationLink_active,
                )}
                exact
                to={PATH_NAMES.projects}
                activeClassName="active"
              >
                <Icon
                  icon="dashboard"
                />
                <span>My Projects</span>
              </NavLink>
              <Button
                className={classNames(
                  styles.navigationExpandBtn,
                  isProjectsListActive && styles.navigationExpandBtn_active,
                )}
                styleType="none"
                onClick={() => openProjectsList()}
              >
                <Icon
                  icon="expand"
                  size={30}
                />
              </Button>
            </div>
            <ul className={classNames(
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
                {projects.map(project => (
                  <li
                    key={project.id}
                    className={classNames(styles.navigationItem)}
                  >
                    <NavLink
                      className={classNames(styles.navigationLink, styles.navigationLink_inner)}
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
