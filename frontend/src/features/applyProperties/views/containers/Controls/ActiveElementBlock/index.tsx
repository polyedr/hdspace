import React, { memo, useCallback } from 'react';
import classNames from 'classnames';

import { LibraryElements } from '$domain/libraryElements/libraryElements';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { ModalAddElements } from '$components/ModalAddElements/ModalAddElements/ModalAddElements';

import { PropertiesPanelProps } from '../../PropertiesPanel/PropertiesPanel';
import { ShowBorders } from '../ShowBorders/ShowBorders';
const styles = require('./styles.scss');

interface IComponentProps {
  activeItem: PropertiesPanelProps['activeItem'],
  disablePanel: boolean,
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
    libraryElements,
    createElements,
    isAddElementsModalOpened,
    setIsAddElementsModalOpened,
  } = props;
  const closeModal = useCallback(() => {
    setIsAddElementsModalOpened(false);
  }, []);

  const showModalAddElements = useCallback(() => {
    setIsAddElementsModalOpened(true);
  }, []);

  return (
    <div
      className={classNames('propsPanelBlock', styles.activeElementContainer)}
    >
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
});
