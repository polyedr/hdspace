import React, { memo, useEffect } from 'react';
import * as R from 'ramda';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../UI/Button';
import ProjectListItem from './ProjectListItem';
import { addProject, getProjectList } from '../../redux/project/actions';
import {
  selectInitialProjectLoad,
  selectProjects,
} from '../../redux/project/selectors';

const styles = require('./Projects.scss');

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const projectList = useSelector(selectProjects);

  const sortedProjectList = R.sort(
    R.descend((project: any) => project.created.getTime()),
    projectList,
  );

  const initialLoadDone = useSelector(selectInitialProjectLoad);

  useEffect(() => {
    if (initialLoadDone) {
      dispatch(getProjectList());
    }
  }, [dispatch]);

  const handleProjectAdd = () => {
    dispatch(addProject('AProject'));
  };

  return (
    <main className={classNames(styles.projectsContainer, 'showAnimation')}>
      <div className={styles.projectsWrapper}>
        <div className={styles.projectsHeaderContainer}>
          <div className={styles.projectsHeader}>All projects</div>
          <Button
            onClick={handleProjectAdd}
            className={styles.projectsHeaderBtn}
          >
            Create a project
          </Button>
        </div>
        <div className={styles.projectsMainBlock}>
          {projectList.length !== 0 && (
            <table
              className={classNames(
                styles.projectsContentTable,
                'showAnimation',
              )}
            >
              <thead>
                <tr>
                  <th className={styles.tableTitle}>
                    <input type="checkbox" />
                  </th>
                  <th className={styles.tableTitle}>Project Status</th>
                  <th className={styles.tableTitle}>Project Name</th>
                  <th className={styles.tableTitle}>Last Edit</th>
                  <th className={styles.tableTitle}>Total Pages</th>
                  <th className={styles.tableTitle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjectList.map((item) => (
                  <ProjectListItem project={item} key={item.id} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

export default memo(Projects);
