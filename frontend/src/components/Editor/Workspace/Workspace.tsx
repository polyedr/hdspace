import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import html2canvas from 'html2canvas';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TopBar } from '../TopBar/TopBar';
import EditorViewport from '../Viewport/Viewport';
import Scrollbar from '../../UI/Scrollbar';
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
import NewTopBar from '../TopBar';
// import FreeCanvas from '../FreeCanvas';

export const formats = ['desktop', 'tablet', 'mobile'] as const;

const useStyles = makeStyles({
  root: {
    padding: '1em',
    display: 'flex',
    flex: '1 1',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  editor: {
    backgroundColor: '#fff',
    border: '1px solid #e7eaec',
    borderTop: 'none',
    overflow: 'auto',
  },
  desktop: {
    flexBasis: '100%',
    minWidth: '100%',
  },
  tablet: {
    flexBasis: (rotated) => (rotated ? 1024 : 768),
  },
  mobile: {
    flexBasis: (rotated) => (rotated ? 568 : 320),
  },
});

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

  const [format, setFormat] = useState(formats[0]);
  const [rotated, setRotated] = useState<boolean>(false);

  const classes = useStyles(rotated);

  const handleFormatChange = (ev, newFormat) => {
    if (!newFormat) return;
    setFormat(newFormat);
  };

  const [currentScreenMode, setCurrentScreenMode] = useState<ScreenMode>({
    ...DEFAULT_SCREEN_MODE,
    isDefaultMode: true,
  });

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

  return (
    <div className={classes.root}>
      <NewTopBar
        format={format}
        handleFormatChange={handleFormatChange}
        rotated={rotated}
        handleRotatedToggle={() => setRotated((prevState) => !prevState)}
      />

      <TopBar
        screenID={currentScreenId}
        isPrototypeMode={isPrototypeMode}
        isScreenRotated={rotated}
        screenMode={currentScreenMode}
        onPrototypeModeToggle={(mode: boolean) =>
          dispatch(changePrototypeMode(mode))
        }
        onScreenModeChange={setCurrentScreenMode}
        onScreenRotate={setRotated}
        onScreenSave={handleSaveScreen}
        onExport={() => dispatch(exportProject())}
      />

      <EditorViewport>
        <Scrollbar
          className={cn(classes.editor, classes[format])}
          autoHeightMin="100%"
        >
          {/* <FreeCanvas /> */}
          <DraggableItem elementId={rootElementId} />
          {!isPrototypeMode && <ElementsInteractions />}
        </Scrollbar>
      </EditorViewport>
    </div>
  );
};

export default Workspace;
