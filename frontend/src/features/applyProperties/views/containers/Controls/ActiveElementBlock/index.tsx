import React, { memo } from 'react';
import classNames from 'classnames';
import * as R from 'ramda';
import ShowBorders from '../ShowBorders/ShowBorders';
import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import ModalAddElements from '../../../../../../components/ModalAddElements/ModalAddElements/ModalAddElements';
import { AVAILABLE_CHILDREN, ENTITIES } from '../../../../../../domain/core';
import { LibraryElements } from '../../../../../../domain/libraryElements/libraryElements';
import { ActiveItem } from '../../../../../../redux/project/types';
import { createElements } from '../../../../../../redux/project/actions';

const styles = require('./styles.scss');

interface IComponentProps {
  activeItem: ActiveItem;
  libraryElements: LibraryElements;
  createElements: typeof createElements;
  isAddElementsModalOpened: boolean;
  setIsAddElementsModalOpened(isOpened: boolean): void;
}

const ActiveElementBlock: React.FC<IComponentProps> = ({
  activeItem,
  libraryElements,
  createElements,
  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const closeModal = () => {
    setIsAddElementsModalOpened(false);
  };

  const showModalAddElements = () => {
    setIsAddElementsModalOpened(true);
  };

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
