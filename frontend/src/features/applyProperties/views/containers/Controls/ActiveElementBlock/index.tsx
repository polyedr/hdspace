import React, { memo, useState, useCallback } from 'react';
import classNames from 'classnames';
import * as R from 'ramda';

import { LibraryElements } from '$domain/libraryElements/libraryElements';
import { AVAILABLE_CHILDREN, Entity, ENTITIES } from '$domain/core';
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
  createElements: PropertiesPanelProps['createElements'],
  isAddElementsModalOpened: boolean;
  showDeleteButton: boolean;
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
    createElements,
    onWrapIntoContainer,
    isAddElementsModalOpened,
    showDeleteButton,
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

  const isElementHaveChildren = () => {
    if (activeItem.itemType === 'none') {
      return false;
    }

    const childrenTypes = Object.keys(AVAILABLE_CHILDREN[activeItem.itemType] ?? []);

    return (
      !!childrenTypes.length &&
      (R.head(childrenTypes) === 'all' ||
      childrenTypes.some((childType) => R.includes(childType, R.keys(ENTITIES))))
    );
  }

  return (
    <div className={classNames('propsPanelBlock', styles.activeElementContainer)}>
      {isElementHaveChildren() && (
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
      )}
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
              {showDeleteButton && (
                <Button
                  className="propsPanelImgBtn"
                  styleType="none"
                  onClick={handleDeleteElement}
                  disabled={disablePanel}
                >
                  <Icon icon="delete" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <ModalAddElements
        activeItem={activeItem}
        active={isAddElementsModalOpened}
        scenarios={scenarios}
        libraryElements={libraryElements}
        onClose={closeModal}
        onConfirm={createElements}
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
