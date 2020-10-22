import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import html2canvas from 'html2canvas';
import { TopBar } from '../TopBar/TopBar';
import EditorViewport from '../Viewport/Viewport';
import Scrollbar from '../../UI/Scrollbar';
import { getClassDevice } from '../../../utils/dom';
import { DEFAULT_SCREEN_MODE } from '../../../constants/defaultParams';
import {
  exportProject,
  resetScreenState,
  saveScreenImage,
} from '../../../redux/project/actions';
import { changePrototypeMode } from '../../../redux/user/actions';
import {
  selectCurrentRootId,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import DraggableItem from '../Draggable/DraggableElement';
import ElementsInteractions from '../ElementsInteractions/ElementsInteractions';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import NNProcessingModal from '../../Dialogs/NNProcessing';
import useGlobalDropTarget from '../../../utils/dragAndDrop/GlobalDropTarget/useGlobalDropTarget';

const styles = require('./Workspace.scss');

export type ScreenMode = {
  isDefaultMode: boolean;
  isTabletMode: boolean;
  isMobileMode: boolean;
};

const Workspace: React.FC = () => {
  const dispatch = useDispatch();

  const rootElementId = useSelector(selectCurrentRootId);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const [currentScreenMode, setCurrentScreenMode] = useState<ScreenMode>({
    ...DEFAULT_SCREEN_MODE,
    isDefaultMode: true,
  });
  const [isScreenRotated, setIsScreenRotated] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => () => {
      dispatch(resetScreenState());
    },
    [dispatch],
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

  useGlobalDropTarget(['smartContainer'], ref);

  return (
    <div className={styles.editorWorkspace} ref={ref}>
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

      <EditorViewport>
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
      </EditorViewport>

      <NNProcessingModal />
    </div>
  );
};

export default Workspace;
