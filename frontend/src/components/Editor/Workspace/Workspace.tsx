import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import html2canvas from 'html2canvas';

import { TopBar } from '../TopBar/TopBar';
import { HotKeys } from '../HotKeys/HotKeys';
import Scrollbar from '../../UI/Scrollbar';
import { getClassDevice } from '../../../utils/dom';
import { AppReduxState } from '../../../shared/types/app';
import { DEFAULT_SCREEN_MODE } from '../../../constants/defaultParams';
import {
  exportProject,
  resetScreenState,
  saveScreenImage,
  setActiveElement,
} from '../../../redux/project/actions';
import { changePrototypeMode } from '../../../redux/user/actions';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import DraggableItem from '../Draggable/DraggableElement';
import ElementsInteractions from '../ElementsInteractions/ElementsInteractions';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';

const styles = require('./Workspace.scss');

export type ScreenMode = {
  isDefaultMode: boolean;
  isTabletMode: boolean;
  isMobileMode: boolean;
};

const Workspace: React.FC<{}> = () => {
  const { rootElementId, activeElementId, isPrototypeMode } = useSelector(
    (state: AppReduxState) => ({
      rootElementId: selectCurrentRootId(state),
      isPrototypeMode: selectIsPrototypeMode(state),
      activeElementId: selectActiveElementId(state),
    }),
  );
  const dispatch = useDispatch();

  const [currentScreenMode, setCurrentScreenMode] = useState<ScreenMode>({
    ...DEFAULT_SCREEN_MODE,
    isDefaultMode: true,
  });
  const [isScreenRotated, setIsScreenRotated] = useState<boolean>(false);
  const currentScreenId = useSelector(selectCurrentScreenId);

  useEffect(
    () => () => {
      dispatch(resetScreenState());
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

      const elementId = target.dataset.lsId;

      if (elementId === activeElementId) return;

      if (elementId) {
        dispatch(
          setActiveElement(elementId === 'root' ? rootElementId : elementId),
        );
      }
    },
    [rootElementId],
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
      }).then((canvas) => dispatch(saveScreenImage(currentScreenId, canvas)));
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
        onPrototypeModeToggle={(mode: boolean) =>
          dispatch(changePrototypeMode(mode))
        }
        onScreenModeChange={setCurrentScreenMode}
        onScreenRotate={setIsScreenRotated}
        onScreenSave={handleSaveScreen}
        onExport={() => dispatch(exportProject())}
      />
      <div className={styles.editorViewport} onClick={handleRootClick}>
        <Scrollbar
          className={cn(
            styles.editorLayout,
            getClassDevice(styles, currentScreenMode, isScreenRotated),
          )}
          autoHeightMin="100%"
        >
          <DraggableItem elementId={rootElementId} />
          {!isPrototypeMode && <ElementsInteractions />}
        </Scrollbar>
      </div>
    </div>
  );
};

export default Workspace;
