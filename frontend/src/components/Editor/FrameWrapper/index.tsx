import React, { FC, useEffect, useContext, useMemo } from 'react';
import { create } from 'jss';
import {
  jssPreset,
  makeStyles,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import Frame, {
  FrameContext,
  FrameContextConsumer,
} from 'react-frame-component';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext } from 'react-dnd';
import { setEditorDocument } from '@Redux/project/actions';
import theme from '@Src/styles/Theme';
import {
  selectCurrentProjectClasses,
  selectImportLoader,
} from '@Redux/project/selectors/base';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';

import { WindowProvider } from './FrameContext';
import useProjectHeaderStyles from '../hooks/useProjectHeaderStyles';

const useStyles = makeStyles({
  loaderWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CustomHead: FC = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <title>Previewer</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <base target="_parent" />
      <style>
        {`
          body {
            padding: 0;
            margin: 0;
            height: 100vh;
          }
          * {
            box-sizing: border-box;
          }
          .frame-root, .frame-content {
            height: 100%;
          }
          .frame-content {
            display: flex;
            flex-direction: column;
          }
          .removeNativeScrollbars::-webkit-scrollbar {
            display: none;
          }
          .removeNativeScrollbars {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
    </>
  );
};

const DndFrame = ({ children }) => {
  const styles = useStyles();
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);
  const isImportLoader = useSelector(selectImportLoader);

  useEffect(() => {
    (dragDropManager?.getBackend() as any)?.addEventListeners(window);
  });

  return isImportLoader ? (
    <div className={styles.loaderWrapper}>
      <CircularProgress size={80} />
    </div>
  ) : (
    children
  );
};

const entityClassNames = Object.keys(DEFAULT_ELEMENTS_STYLES);

export const FrameWrapper: FC<any> = ({ children, ...props }) => {
  const dispatch = useDispatch();

  const projectClasses = useSelector(selectCurrentProjectClasses);

  const entityClasses = useMemo(() => {
    return projectClasses.filter((classInstance) =>
      entityClassNames.includes(classInstance.className),
    );
  }, [projectClasses]);

  const sharedClasses = useMemo(() => {
    return projectClasses.filter(
      (classInstance) => !entityClassNames.includes(classInstance.className),
    );
  }, [projectClasses]);

  const entityStylesEl = useProjectHeaderStyles(entityClasses);
  const sharedStylesEl = useProjectHeaderStyles(sharedClasses);

  return (
    <Frame
      {...props}
      head={<CustomHead />}
      height="100%"
      width="100%"
      frameBorder={0}
      scrolling="no"
    >
      <FrameContextConsumer>
        {({ document: frameDocument, window: frameWindow }) => {
          const jss = create({
            plugins: [...jssPreset().plugins],
            insertionPoint: frameDocument.head,
          });

          frameDocument.head.prepend(entityStylesEl);
          frameDocument.head.prepend(sharedStylesEl);

          [...document.head.children].forEach((child) => {
            frameDocument.head.appendChild(child.cloneNode(true));
          });

          dispatch(setEditorDocument(frameDocument));

          return (
            <DndFrame>
              <WindowProvider value={frameWindow}>
                <StylesProvider jss={jss}>
                  <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </StylesProvider>
              </WindowProvider>
            </DndFrame>
          );
        }}
      </FrameContextConsumer>
    </Frame>
  );
};

export default FrameWrapper;
