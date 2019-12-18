import React, { memo, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { Modal } from '$components/UI/Modal';
import { ILeftPanel } from '$components/LeftPanel';
import { EditorProps } from '$containers/EditorLogic';
import * as Actions from '$redux/project/actions';
import { selectors } from '$redux/project';

const styles = require('./styles.scss');

const mapStateToProps = (state: AppReduxState) => ({
  project: selectors.selectCurrentProject(state),
});

const mapDispatchToProps = {
  renameProject: Actions.renameProject,
};

type TTopPanelProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {
  pathname: string,
  isLPanelMinimized: ILeftPanel['isLPanelMinimized'],
  project: EditorProps['currentProject'],
  onMinimiserLPanel(): void,
  renameProject: typeof Actions.renameProject,
}

const Component: React.FunctionComponent<TTopPanelProps> = memo(({
  project,
  pathname,
  isLPanelMinimized,
  onMinimiserLPanel,
  renameProject,
}) => {
  const [search, setSearch] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [modalRenameProjectOpen, setModalRenameProjectOpen] = useState(false);

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const closelModal = useCallback(() => {
    setNewProjectName(project.name);
    setModalRenameProjectOpen(false);
  }, [project.name]);

  const handleRenameProject = useCallback(() => {
    setNewProjectName(project.name);
    setModalRenameProjectOpen(true);
  }, [project.name]);

  const onRenameProject = useCallback((event) => {
    event.preventDefault();

    renameProject(project.id, newProjectName);
    closelModal();
  }, [project, newProjectName, renameProject, closelModal]);

  const handleNewProjectName = useCallback(({ target: { value } }) => {
    setNewProjectName(value);
  }, []);

  return (
    <header className={classNames(styles.topPanel, isLPanelMinimized && styles.topPanel_minimize)}>
      <div className={styles.topPanelLeftBlock}>
        <Button
          className={styles.topPanelBtn}
          styleType="confirm"
          onClick={onMinimiserLPanel}
        >
          <Icon icon="menu" size={20} />
        </Button>
      </div>
      {
        pathname !== '/projects' && (
          <div className={styles.topPanelCenterBlock}>
            <p
              className={styles.topPanelProjectTitle}
            >
              {project.name}
            </p>
            <Button
              className={classNames('mainImgBtn', styles.editProjectBtn)}
              styleType="none"
              onClick={handleRenameProject}
              // onClick={event => this.handleRenameProject(event)}
            >
              <Icon icon="edit" size={20} />
            </Button>
          </div>
        )
      }
      <div className={styles.topPanelRightBlock}>
        <Button
          className="mainImgBtn"
          styleType="none"
          onClick={console.log}
        >
          <Icon icon="menu" size={20} />
        </Button>
      </div>
      { modalRenameProjectOpen && (
      <Modal
        animClassName="bubbleAnimation"
        title="Rename project"
        confirmText="Rename"
        onConfirm={event => onRenameProject(event)}
        cancelText="Close"
        onClose={closelModal}
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
});

export const TopPanel = connect(mapStateToProps, mapDispatchToProps)(Component);
