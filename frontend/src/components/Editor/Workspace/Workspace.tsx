import React, { useState, useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import cn from 'classnames';
import html2canvas from 'html2canvas';

import { TopBar } from '../TopBar/TopBar';
import { HotKeys } from '../HotKeys/HotKeys';
// import ContainersBorders from '../ContainersBorders/ContainersBorders';
import Borders from '../ContainersBorders/Borders';
import Scrollbar from '../../UI/Scrollbar';
import { SortableContainer } from '../SortableContainer/SortableContainer';
import { Entity } from '../../../domain/core';
import { LibraryElement, LibraryElementUnion } from '../../../api/types';
import { getListNotDragging } from '../../../utils/parseScenario';
import { getClassDevice } from '../../../utils/dom';
import { AppReduxState } from '../../../shared/types/app';
import { DEFAULT_SCREEN_MODE } from '../../../constants/defaultParams';
import { ActiveItem } from '../../../redux/project/types';
import {
  exportProject,
  resetScreenState,
  saveScreenImage,
  setActiveElementId,
} from '../../../redux/project/actions';
import { changePrototypeMode } from '../../../redux/user/actions';
import {
  selectActiveElement,
  selectCurrentRootElement,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';

const styles = require('./Workspace.scss');

export type ScreenMode = {
  isDefaultMode: boolean;
  isTabletMode: boolean;
  isMobileMode: boolean;
};

type StateProps = {
  elementsTree: LibraryElement<'root'>;
  isPrototypeMode: boolean;
  activeElement: ActiveItem;
};

const mapDispatch = {
  saveScreen: saveScreenImage,
  changePrototypeMode,
  resetScreenState,
  setActiveItem: setActiveElementId,
  exportProject,
};

const mapState = (state: AppReduxState): StateProps => ({
  elementsTree: selectCurrentRootElement(state),
  activeElement: selectActiveElement(state),
  isPrototypeMode: state.user.isPrototypeMode,
});

type Props = StateProps & typeof mapDispatch;

const Workspace: React.FC<Props> = ({
  elementsTree,
  isPrototypeMode,
  activeElement,
  setActiveItem,
  saveScreen,
  changePrototypeMode,
  resetScreenState,
  exportProject,
}) => {
  const [isMoving, setIsMoving] = useState<boolean>(true);
  const [listNotDragging, setListNotDragging] = useState<string[]>([]);
  const [currentScreenMode, setCurrentScreenMode] = useState<ScreenMode>({
    ...DEFAULT_SCREEN_MODE,
    isDefaultMode: true,
  });
  const [isScreenRotated, setIsScreenRotated] = useState<boolean>(false);
  const [hasItemBeingResized, setHasItemBeingResized] = useState<boolean>(
    false,
  );
  const currentScreenId = useSelector(selectCurrentScreenId);

  useEffect(
    () => () => {
      resetScreenState();
    },
    [],
  );

  const handleActiveElementChange = (
    parentId: number,
    item: LibraryElement<Entity>,
  ) => {
    const { id: itemId, type } = item;
    const list = getListNotDragging(type);

    setActiveItem(itemId);
    setListNotDragging(list);
  };

  const handleRootClick = useCallback(
    (event: React.MouseEvent) => {
      const target = (event.nativeEvent.target as HTMLElement)?.closest(
        '[data-ls-id]',
      ) as HTMLElement;
      if (!target) return;

      const currentActiveElement = (document.activeElement as HTMLElement)?.closest(
        '[data-ls-id]',
      );
      const mouseUpTriggeredClick = currentActiveElement !== target;

      if (mouseUpTriggeredClick) return;

      const itemID = target.dataset.lsId;

      if (itemID === activeElement.id) return;

      if (itemID) {
        if (itemID === 'root') {
          setActiveItem(elementsTree.id);
        } else {
          const { type } = activeElement;
          const list = getListNotDragging(type);

          setActiveItem(itemID);
          setListNotDragging(list);
        }
      }
    },
    [activeElement, elementsTree],
  );

  const handleLSItemMouseOver = useCallback(
    (event: React.MouseEvent) => {
      if (!isPrototypeMode && !hasItemBeingResized) {
        (event.target as HTMLElement)
          ?.closest?.('.ls-item')
          ?.classList.add('hovered');
      }
    },
    [isPrototypeMode, hasItemBeingResized],
  );

  const handleLSItemMouseOut = useCallback(
    (event: React.MouseEvent) => {
      if (!isPrototypeMode && !hasItemBeingResized) {
        (event.target as HTMLElement)
          ?.closest?.('.ls-item')
          ?.classList.remove('hovered');
      }
    },
    [isPrototypeMode, hasItemBeingResized],
  );

  const handleSaveScreen = () => {
    const screenBody = document.getElementById('root');
    const widgets = Array.from(document.querySelectorAll('iframe'));

    if (screenBody !== null) {
      const ignore = (element: Element) =>
        widgets.some((widget) => element === widget);

      html2canvas(screenBody, {
        useCORS: true,
        allowTaint: true,
        logging: true,
        ignoreElements: ignore,
      }).then((canvas) => saveScreen(currentScreenId, canvas));
    }
  };

  return (
    <div className={cn(styles.editorWorkspace)}>
      {!isPrototypeMode && <HotKeys />}
      <TopBar
        screenID={currentScreenId}
        isPrototypeMode={isPrototypeMode}
        isScreenRotated={isScreenRotated}
        screenMode={currentScreenMode}
        onPrototypeModeToggle={changePrototypeMode}
        onScreenModeChange={setCurrentScreenMode}
        onScreenRotate={setIsScreenRotated}
        onScreenSave={handleSaveScreen}
        onExport={exportProject}
      />
      <div
        className={styles.editorViewport}
        onClick={handleRootClick}
        onMouseOver={handleLSItemMouseOver}
        onMouseOut={handleLSItemMouseOut}
      >
        <Scrollbar
          className={cn(
            styles.editorLayout,
            getClassDevice(styles, currentScreenMode, isScreenRotated),
          )}
          autoHeightMin="100%"
        >
          <SortableContainer
            item={elementsTree as LibraryElementUnion}
            activeItemId={activeElement.id}
            isMoving={isMoving}
            listNotDragging={listNotDragging}
            setIsMoving={setIsMoving}
            onActiveElementChange={handleActiveElementChange} // needed to activate item before dragging, in order to get new listNotDraggable
            isResizing={hasItemBeingResized}
            setIsResizing={setHasItemBeingResized}
          />
          {/*! isPrototypeMode && <ContainersBorders /> */}
          {!isPrototypeMode && <Borders />}
        </Scrollbar>
      </div>
    </div>
  );
};

export default connect(mapState, mapDispatch)(Workspace);
