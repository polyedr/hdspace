import React, { useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { convertDateToRelative } from '$utils/convertDateToRelative';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { Project } from '$api/types';
import { Modal } from '$components/UI/Modal';
import { delProject, renameProject } from '$redux/project/actions';

const styles = require('./Projects.scss');

type Props = {
  project: Project;
};

const ProjectListItem: React.FC<Props> = ({
  project: { status, id, name, updated, projectscreen },
}) => {
  const dispatch = useDispatch();

  const [modalRenameProjectOpen, setModalRenameProjectOpen] = useState(false);
  const [modalDeleteProjectOpen, setModalDeleteProjectOpen] = useState(false);

  const [newProjectName, setNewProjectName] = useState(name);

  const closeModal = () => {
    setModalRenameProjectOpen(false);
    setModalDeleteProjectOpen(false);
  };

  const handleNewProjectNameChange = (ev: any) => {
    setNewProjectName(ev.target.value);
  };

  const handleRenameProject = () => {
    setModalRenameProjectOpen(true);
  };

  const handleDeleteProject = () => {
    setModalDeleteProjectOpen(true);
  };

  const onRenameProject = (ev: any) => {
    ev.preventDefault();
    dispatch(renameProject(id, newProjectName));
    closeModal();
  };

  const onDeleteProject = (ev: any) => {
    ev.preventDefault();
    dispatch(delProject(id));
    closeModal();
  };

  return (
    <>
      <tr className={styles.tableRow}>
        <td className={styles.tableItem}>
          <input type="checkbox" checked={false} onChange={() => {}} />
        </td>

        <td className={classNames(styles.tableItem, styles.tableItem_status)}>
          {status}
        </td>

        <td className={styles.tableItem}>
          <Link to={`/project/${id}`}>{name}</Link>
        </td>

        <td className={styles.tableItem}>{convertDateToRelative(updated)}</td>

        <td className={styles.tableItem}>{projectscreen.length}</td>

        <td className={styles.tableItem}>
          <Button
            className={styles.tableBtn}
            styleType="none"
            onClick={handleRenameProject}
          >
            <Icon icon="edit" size={20} />
          </Button>

          <Button
            className={styles.tableBtn}
            styleType="none"
            onClick={handleDeleteProject}
          >
            <Icon icon="delete" size={20} />
          </Button>
        </td>
      </tr>

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
              placeholder="New project name"
              onChange={handleNewProjectNameChange}
            />
          </div>
        </Modal>
      )}

      {modalDeleteProjectOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Delete project"
          confirmText="Delete forever"
          onConfirm={onDeleteProject}
          cancelText="Close"
          onClose={closeModal}
        >
          <div className={styles.modalBody}>
            <p>{`This project named as ${name} and its styles, pages, and images will be deleted permanently`}</p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectListItem;
