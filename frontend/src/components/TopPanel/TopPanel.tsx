import React, { memo, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as Actions from '../../redux/project/actions';
import { LeftPanelProps } from '../LeftPanel/LeftPanel';
import Button from '../UI/Button';
import Icon from '../UI/Icon';
import Modal from '../UI/Modal';
import { EditorProps } from '../../containers/EditorLogic';
import { selectCurrentProject } from '../../redux/project/selectors';
import { AppReduxState } from '../../shared/types/app';

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
  const [newProjectName, setNewProjectName] = useState('');
  const [modalRenameProjectOpen, setModalRenameProjectOpen] = useState(false);

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
            // onClick={event => this.handleRenameProject(event)}
          >
            <Icon icon="edit" size={20} />
          </Button>
        </div>
      )}
      <div className={styles.topPanelRightBlock} />
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
