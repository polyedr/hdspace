import React, { useCallback } from 'react';

import { getOptionsOfNestedList } from '$utils/parseScenario';
import { NestedList } from '$components/UI/NestedList/';
import { Modal } from '$components/UI/Modal/';
import { IScenarioElements } from '$redux/project/types';

import { IRightPanelProps } from '../../MainPanel';
const styles = require('./styles.scss');

interface IComponentProps {
  scenarios: IRightPanelProps['scenarios'],
  scenarioElements: IScenarioElements,
  delScenario: IRightPanelProps['delScenario'],
  renameScenario: IRightPanelProps['renameScenario'],
}

export const ScenarioList: React.FunctionComponent<IComponentProps> = ({
  scenarios,
  scenarioElements,
  delScenario,
  renameScenario,
}) => {
  const [modalRenameScenarioOpen, setModalRenameScenarioOpen] = React.useState<boolean>(false);
  const [modalDeleteScenarioOpen, setModalDeleteScenarioOpen] = React.useState<boolean>(false);
  const [newScenarioName, setNewScenarioName] = React.useState<string>('');
  const [changeScenarioId, setChangeScenarioId] = React.useState<number>(-1);

  const closeModal = useCallback(() => {
    setNewScenarioName('');
    setModalRenameScenarioOpen(false);
    setModalDeleteScenarioOpen(false);
  }, []);

  const changeNewScenarioName = useCallback((event) => {
    setNewScenarioName(event.target.value);
  }, []);

  const handleClickList = useCallback((scenarioId, btnName) => {
    setChangeScenarioId(scenarioId);

    if (btnName === 'delete') {
      setModalDeleteScenarioOpen(true);
    } else if (btnName === 'edit') {
      setModalRenameScenarioOpen(true);
    }
  }, []);

  const onDeleteScenario = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    closeModal();

    delScenario(`${changeScenarioId}s`);
  }, [closeModal, changeScenarioId, delScenario]);

  const onRenameScenario = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    closeModal();
    renameScenario(changeScenarioId, newScenarioName);
  }, [closeModal, newScenarioName, changeScenarioId, renameScenario]);


  return (
    <div className="propsPanelBlock">
      <div className="propsPanelHeaderBlock">
        <p>Scenarios list</p>
      </div>
      <div className="propsPanelContentBlock">
        <NestedList
          className={styles.scenarioList}
          options={getOptionsOfNestedList(scenarios, scenarioElements)}
          onClickList={handleClickList}
          onClickItem={console.log}
          iconListNames={['edit', 'delete']}
        />
      </div>
      { modalRenameScenarioOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Rename scenario"
          confirmText="Rename"
          onConfirm={onRenameScenario}
          cancelText="Close"
          onClose={closeModal}
        >
          <div className={styles.modalBody}>
            <input
              type="text"
              className="modalTextInput"
              value={newScenarioName}
              placeholder="New scenario name"
              onChange={changeNewScenarioName}
              required
            />
          </div>
        </Modal>
      )}
      { modalDeleteScenarioOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Delete scenario"
          confirmText="Delete"
          onConfirm={event => onDeleteScenario(event)}
          cancelText="Close"
          onClose={closeModal}
        >
          <div className={styles.modalBody}>
            <p>
              You really want to delete this scenario?
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
