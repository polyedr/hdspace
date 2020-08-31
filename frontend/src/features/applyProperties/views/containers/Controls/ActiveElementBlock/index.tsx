import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import * as R from 'ramda';

import { LibraryElements } from '$domain/libraryElements/libraryElements';
import { AVAILABLE_CHILDREN, ENTITIES } from '$domain/core';
import Icon from '$components/UI/Icon/';
import Button from '$components/UI/Button/';
import ModalAddElements from '$components/ModalAddElements/ModalAddElements/ModalAddElements';
import { PropertiesPanelProps } from '$features/applyProperties';

import ShowBorders from '../ShowBorders/ShowBorders';

const styles = require('./styles.scss');

interface IComponentProps {
  activeItem: PropertiesPanelProps['activeItem'];
  disablePanel: boolean;
  libraryElements: LibraryElements;
  createElements: PropertiesPanelProps['createElements'];
  isAddElementsModalOpened: boolean;
  showDeleteButton: boolean;
  setIsAddElementsModalOpened(isOpened: boolean): void;
}

const ActiveElementBlock: React.FC<IComponentProps> = ({
  activeItem,
  libraryElements,
  createElements,
  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const closeModal = useCallback(() => {
    setIsAddElementsModalOpened(false);
  }, []);

  const showModalAddElements = useCallback(() => {
    setIsAddElementsModalOpened(true);
  }, []);

  const isElementHaveChildren = () => {
    if (activeItem.itemType === 'none') {
      return false;
    }

    const childrenTypes = Object.keys(
      AVAILABLE_CHILDREN[activeItem.itemType] ?? [],
    );

    return (
      !!childrenTypes.length &&
      (R.head(childrenTypes) === 'all' ||
        childrenTypes.some((childType) =>
          R.includes(childType, R.keys(ENTITIES)),
        ))
    );
  };

  return (
    <div
      className={classNames('propsPanelBlock', styles.activeElementContainer)}
    >
      {isElementHaveChildren && (
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
        <ShowBorders />
      </div>
      <ModalAddElements
        activeItem={activeItem}
        active={isAddElementsModalOpened}
        libraryElements={libraryElements}
        onClose={closeModal}
        onConfirm={createElements}
      />
    </div>
  );
};

export default memo(ActiveElementBlock);
