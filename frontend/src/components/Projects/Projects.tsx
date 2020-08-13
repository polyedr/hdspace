import React, { memo, useState, useCallback, useEffect } from 'react';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '$redux/project/actions';
import { Button } from '$components/UI/Button';
import { Modal } from '$components/UI/Modal';
import { Icon } from '$components/UI/Icon';
import { Project } from '$api/types';
import { convertDateToRelative } from '$utils/convertDateToRelative';
import { selectInitialProjectLoad } from '$redux/project/selectors';
import { getListProject } from '$redux/project/actions';

const styles = require('./Projects.scss');

interface IProjectsProps {
  listProject: Project[];
  addProject: typeof Actions.addProject;
  delProject: typeof Actions.delProject;
  renameProject: typeof Actions.renameProject;
}

export const Projects: React.FunctionComponent<IProjectsProps> = memo(
  ({ listProject, addProject, delProject, renameProject }) => {
    const dispatch = useDispatch();

    const [newProjectName, setNewProjectName] = useState('');
    const [changeProject, setChangeProject] = useState({ id: -1, name: '' });
    const [modalRenameProjectOpen, setModalRenameProjectOpen] = useState(false);
    const [modalDeleteProjectOpen, setModalDeleteProjectOpen] = useState(false);

    const sortedListProject = R.sort(
      R.descend((project) => project.created.getTime()),
      listProject,
    );

    const initialLoadDone = useSelector(selectInitialProjectLoad);

    useEffect(() => {
      if (initialLoadDone) {
        dispatch(getListProject());
      }
    }, [dispatch]);

    const handleProjectAdd = useCallback(() => {
      addProject('AProject');
    }, []);

    const closeModal = useCallback(() => {
      setNewProjectName('');
      setModalRenameProjectOpen(false);
      setModalDeleteProjectOpen(false);
    }, []);

    const handleRenameProject = useCallback((item) => {
      setChangeProject({ id: item.id, name: item.name });
      setNewProjectName(item.name);
      setModalRenameProjectOpen(true);
    }, []);

    const handleDeleteProject = useCallback((item) => {
      setChangeProject({ id: item.id, name: item.name });
      setModalDeleteProjectOpen(true);
    }, []);

    const handleNewProjectNameChange = useCallback(({ target: { value } }) => {
      setNewProjectName(value);
    }, []);

    const onRenameProject = useCallback(
      (event) => {
        event.preventDefault();
        renameProject(changeProject.id, newProjectName);
        closeModal();
      },
      [closeModal, changeProject, newProjectName, renameProject],
    );

    const onDeleteProject = useCallback(
      (event) => {
        event.preventDefault();
        delProject(changeProject.id);
        closeModal();
      },
      [closeModal, delProject, changeProject],
    );

    return (
      <main className={classNames(styles.projectsContainer, 'showAnimation')}>
        <div className={styles.projectsWrapper}>
          <div className={styles.projectsHeader}>
            <Button
              onClick={handleProjectAdd}
              className={styles.projectsHeaderBtn}
            >
              Create a project
            </Button>
          </div>
          <div className={styles.projectsMainBlock}>
            {listProject.length !== 0 && (
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
                  {sortedListProject.map((item) => (
                    <tr className={styles.tableRow} key={item.id}>
                      <td className={styles.tableItem}>
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => {}}
                        />
                      </td>
                      <td
                        className={classNames(
                          styles.tableItem,
                          styles.tableItem_status,
                        )}
                      >
                        {item.status}
                      </td>
                      <td className={styles.tableItem}>
                        <Link to={`/project/${item.id}`}>{item.name}</Link>
                      </td>
                      <td className={styles.tableItem}>
                        {convertDateToRelative(item.updated)}
                      </td>
                      <td className={styles.tableItem}>
                        {(R.prop('projectscreen', item) || []).length}
                      </td>
                      <td className={styles.tableItem}>
                        <Button
                          className={styles.tableBtn}
                          styleType="none"
                          onClick={() => handleRenameProject(item)}
                        >
                          <Icon icon="edit" size={20} />
                        </Button>
                        <Button
                          className={styles.tableBtn}
                          styleType="none"
                          onClick={() => handleDeleteProject(item)}
                        >
                          <Icon icon="delete" size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {modalRenameProjectOpen && (
          <Modal
            animClassName="bubbleAnimation"
            title="Rename project"
            confirmText="Rename"
            onConfirm={onRenameProject}
            cancelText="Close"
            onClose={closeModal}
          >
            <div className={styles.modalBody}>
              <input
                type="text"
                className={styles.screenName}
                value={newProjectName}
                placeholder="New screen name"
                onChange={handleNewProjectNameChange}
              />
            </div>
          </Modal>
        )}
        {modalDeleteProjectOpen && (
          <Modal
            animClassName="bubbleAnimation"
            title="Delete project"
            confirmText="Delete"
            onConfirm={onDeleteProject}
            cancelText="Close"
            onClose={closeModal}
          >
            <div className={styles.modalBody}>
              <p>{`You really want to delete project ${changeProject.name}`}</p>
            </div>
          </Modal>
        )}
      </main>
    );
  },
);
