import React, { memo, useState, useCallback } from 'react';
import classNames from 'classnames';

import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { Modal } from '$components/UI/Modal/';
import { ModalAddElements } from '$components/ModalAddElements/MainBlock/';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { IRightPanelProps } from '$components/RightPanel/MainPanel/';
import { NavigateItem } from '$components/Editor/NavigateItem/';

const styles = require('./styles.scss');

interface IComponentProps {
  activeItem: IPanelEditProps['activeItem'],
  disablePanel: IPanelEditProps['disablePanel'],
  onDelScenarioItem: IPanelEditProps['onDelScenarioItem'],
  scenarios: IRightPanelProps['scenarios'],
  libraryElements: IRightPanelProps['libraryElements'],
  addScenario: IRightPanelProps['addScenario'],
  addContainer: IRightPanelProps['addContainer'],
}

export const ActiveElementBlock: React.FunctionComponent<IComponentProps> = memo((props) => {
  const {
    activeItem,
    disablePanel,
    onDelScenarioItem,
    scenarios,
    libraryElements,
    addScenario,
    addContainer,
  } = props;
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [modalDeleteElementOpen, setModalDeleteElementOpen] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    setActiveModal(false);
    setModalDeleteElementOpen(false);
  }, []);

  const showModalAddElements = useCallback(() => {
    setActiveModal(true);
  }, [setActiveModal]);

  const handleDeleteElement = useCallback(() => {
    setModalDeleteElementOpen(true);
  }, []);

  const onDeleteScenarioItem = useCallback((event) => {
    event.preventDefault();

    onDelScenarioItem();
    closeModal();
  }, [onDelScenarioItem, closeModal]);

  const renameElement = useCallback(() => {
    console.log('rename element');
  }, []);

  return (
    <div className={classNames('propsPanelBlock', styles.activeElementContainer)}>
      <div className="propsPanelHeaderBlock">
        <p>Properties</p>
        <Button
          className={classNames('addBtn', styles.addElementBtn)}
          styleType="none"
          onClick={showModalAddElements}
        >
          <Icon icon="add" />
        </Button>
      </div>
      <div className="propsPanelContentBlock">
        <div className="propsPanelInnerContentBlock">
          <p className="propsPanelText">
            {`select: ${activeItem.name}-${activeItem.itemId}`}
          </p>
          { activeItem.parentId !== -1 && (
            <div className="propsPanelBtnBlock">
              <NavigateItem
                activeItem={activeItem}
                addContainer={addContainer}
              />
              <Button
                className="propsPanelImgBtn"
                styleType="none"
                onClick={renameElement}
              >
                <Icon icon="edit" />
              </Button>
              <Button
                className="propsPanelImgBtn"
                styleType="none"
                onClick={handleDeleteElement}
                disabled={disablePanel}
              >
                <Icon icon="delete" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <ModalAddElements
        active={activeModal}
        scenarios={scenarios}
        libraryElements={libraryElements}
        onClose={closeModal}
        onConfirm={addScenario}
      />
      { modalDeleteElementOpen && (
        <Modal
          animClassName="bubbleAnimation"
          title="Delete element"
          confirmText="Delete"
          onConfirm={onDeleteScenarioItem}
          cancelText="Close"
          onClose={closeModal}
        >
          <div className={styles.modalBody}>
            <p>
              { `You really want to delete item: ${activeItem.name}` }
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
});
