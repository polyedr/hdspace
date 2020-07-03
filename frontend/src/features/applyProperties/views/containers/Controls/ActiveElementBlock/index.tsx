import React, { memo, useState, useCallback } from 'react';
import classNames from 'classnames';

import { LibraryElements } from '$domain/libraryElements/libraryElements';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { Modal } from '$components/UI/Modal/';
import { ModalAddElements } from '$components/ModalAddElements/ModalAddElements/ModalAddElements';
import { NavigateItem } from '$components/Editor/NavigateItem/NavigateItem';

import { PropertiesPanelProps } from '../../PropertiesPanel/PropertiesPanel';
const styles = require('./styles.scss');

interface IComponentProps {
  activeItem: PropertiesPanelProps['activeItem'],
  disablePanel: boolean,
  scenarios: PropertiesPanelProps['scenarios'],
  libraryElements: LibraryElements,
  addElementsIntoContainer: PropertiesPanelProps['addElementsIntoContainer'],
  isAddElementsModalOpened: boolean;
  onWrapIntoContainer(): void;
  onDelScenarioItem(): void;
  setIsAddElementsModalOpened(isOpened: boolean): void;
}

export const ActiveElementBlock: React.FunctionComponent<IComponentProps> = memo((props) => {
  const {
    activeItem,
    disablePanel,
    onDelScenarioItem,
    scenarios,
    libraryElements,
    addElementsIntoContainer,
    onWrapIntoContainer,
    isAddElementsModalOpened,
    setIsAddElementsModalOpened,
  } = props;
  const [modalDeleteElementOpen, setModalDeleteElementOpen] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    setIsAddElementsModalOpened(false);
    setModalDeleteElementOpen(false);
  }, []);

  const showModalAddElements = useCallback(() => {
    setIsAddElementsModalOpened(true);
  }, []);

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
        <p>Add elements</p>
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
          { activeItem && (
            <div className="propsPanelBtnBlock">
              <NavigateItem
                onWrapIntoContainer={onWrapIntoContainer}
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
        active={isAddElementsModalOpened}
        scenarios={scenarios}
        libraryElements={libraryElements}
        onClose={closeModal}
        onConfirm={addElementsIntoContainer}
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
