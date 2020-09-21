import React, { useState, useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import cn from 'classnames';
import html2canvas from 'html2canvas';

import { TopBar } from '../TopBar/TopBar';
import { HotKeys } from '../HotKeys/HotKeys';
// import ContainersBorders from '../ContainersBorders/ContainersBorders';
import Borders from '../ContainersBorders/Borders';
import Scrollbar from '../../UI/Scrollbar';
/* import SortableContainer from '../SortableContainer/SortableContainer';
import { Entity } from '../../../domain/core'; */
import { LibraryElement, LibraryElementUnion } from '../../../api/types';
import { getClassDevice } from '../../../utils/dom';
import { findChildByID } from '../../../utils/ElementsTreeHelper';
import { AppReduxState } from '../../../shared/types/app';
import { DEFAULT_SCREEN_MODE } from '../../../constants/defaultParams';
import { ActiveItem } from '../../../redux/project/types';
import {
  exportProject,
  resetScreenState,
  saveScreenImage,
  setActiveItem,
} from '../../../redux/project/actions';
import { changePrototypeMode } from '../../../redux/user/actions';
import {
  selectActiveItem,
  selectRootElement,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import DraggableItem from '../../Draggable/DraggableItem';

const styles = require('./Workspace.scss');

export type ScreenMode = {
  isDefaultMode: boolean;
  isTabletMode: boolean;
  isMobileMode: boolean;
};

type StateProps = {
  elementsTree: LibraryElement<'root'>;
  isPrototypeMode: boolean;
  activeItem: ActiveItem;
};

const mapDispatch = {
  saveScreen: saveScreenImage,
  changePrototypeMode,
  resetScreenState,
  setActiveItem,
  exportProject,
};

const mapState = (state: AppReduxState): StateProps => ({
  elementsTree: selectRootElement(state),
  activeItem: selectActiveItem(state),
  isPrototypeMode: state.user.isPrototypeMode,
});

type Props = StateProps & typeof mapDispatch;

const Workspace = ({
  elementsTree,
  isPrototypeMode,
  activeItem,
  setActiveItem,
  saveScreen,
  changePrototypeMode,
  resetScreenState,
  exportProject,
}: Props) => {
  const [currentScreenMode, setCurrentScreenMode] = useState<ScreenMode>({
    ...DEFAULT_SCREEN_MODE,
    isDefaultMode: true,
  });
  const [isScreenRotated, setIsScreenRotated] = useState<boolean>(false);
  const currentScreenId = useSelector(selectCurrentScreenId);

  useEffect(
    () => () => {
      resetScreenState();
    },
    [],
  );

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

      if (itemID === activeItem.itemId) return;

      if (itemID) {
        if (itemID === 'root') {
          setActiveItem({
            itemId: elementsTree.id,
            itemType: 'root',
            name: 'Root',
          });
        } else {
          const actualActiveItem = findChildByID(elementsTree, itemID);

          if (actualActiveItem) {
            const { type, name } = actualActiveItem;

            setActiveItem({ itemId: itemID, itemType: type, name });
          }
        }
      }
    },
    [activeItem, elementsTree, findChildByID],
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
      <div className={styles.editorViewport} onClick={handleRootClick}>
        <Scrollbar
          className={cn(
            styles.editorLayout,
            getClassDevice(styles, currentScreenMode, isScreenRotated),
          )}
          autoHeightMin="100%"
        >
          <DraggableItem item={elementsTree as LibraryElementUnion} />
          {!isPrototypeMode && <Borders />}
        </Scrollbar>
      </div>
    </div>
  );
};

export default connect(mapState, mapDispatch)(Workspace);
