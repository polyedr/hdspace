// @ts-nocheck
import React, { FC, useEffect, useRef, useContext, useMemo } from 'react';
import { create } from 'jss';
import {
  jssPreset,
  makeStyles,
  StylesProvider,
  ThemeProvider,
} from '@mui/styles';
import { CircularProgress } from '@mui/material';
import { StyleSheetManager } from 'styled-components';
import createCache from '@emotion/cache';
import Frame, {
  FrameContext,
  FrameContextConsumer,
} from 'react-frame-component';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext } from 'react-dnd';
import { setEditorDocument } from '@Redux/project/actions';
import { theme } from '@Src/styles/Theme';
import {
  selectCurrentProjectClasses,
  selectCurrentUIFramework,
  selectImportLoader,
  selectShowingGrid,
} from '@Redux/project/selectors/base';
import ELEMENT_IDS from '@Constants/elementIds';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';

import { selectFreeCanvasMode } from '@Redux/project/selectors/screen';
import GridLines from 'react-gridlines';
import { WindowProvider } from './FrameContext';
import useProjectHeaderStyles from '../hooks/useProjectHeaderStyles';
import { CacheProvider } from '@emotion/react';

const useStyles = makeStyles({
  loaderWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CustomHead: FC = () => {
  const uiFramework = useSelector(selectCurrentUIFramework);
  const frameworkVersion = uiFramework?.version;

  return (
    <>
      <meta charSet="utf-8" />
      <title>Previewer</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <base target="_parent" />
      <style key="body_style">
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
                        .root{
                          height:100vh;
                        }`}
      </style>

      {frameworkVersion && (
        <>
          {frameworkVersion.styleSheetsData.map(
            ({ key, link, ...otherParams }) => (
              <link
                key={key}
                rel="stylesheet"
                type="text/css"
                href={link}
                {...otherParams}
              />
            ),
          )}
          {frameworkVersion.scriptsData.map(({ key, link, ...otherParams }) => (
            <script
              key={key}
              type="text/javascript"
              src={link}
              {...otherParams}
            />
          ))}
          {uiFramework.themeVariables && (
            <style type="text/css">
              {`:root {
              ${Object.keys(uiFramework.themeVariables)
                .map(
                  (varName) =>
                    `--${varName}: ${uiFramework.themeVariables[varName]}`,
                )
                .join(';')}
          }`}
            </style>
          )}
        </>
      )}
    </>
  );
};

function DndFrame({ children }) {
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
}

const entityClassNames = Object.keys(DEFAULT_ELEMENTS_STYLES);

export const FrameWrapper: FC<any> = ({ children, ...props }) => {
  const dispatch = useDispatch();

  const ref = useRef<{ node: HTMLIFrameElement }>(null);

  useEffect(() => {
    if (ref.current?.node?.contentDocument) {
      dispatch(setEditorDocument(ref.current.node.contentDocument));
    }
  }, [dispatch]);

  useEffect(() => {
    if (ref.current?.node.contentDocument?.head) {
      [...document.head.children].forEach((child) => {
        ref.current?.node.contentDocument?.head.appendChild(
          child.cloneNode(true),
        );
      });
    }
  });

  const projectClasses = useSelector(selectCurrentProjectClasses);

  const entityClasses = useMemo(
    () =>
      projectClasses.filter((classInstance) =>
        entityClassNames.includes(classInstance.className),
      ),
    [projectClasses],
  );

  const sharedClasses = useMemo(
    () =>
      projectClasses.filter(
        (classInstance) => !entityClassNames.includes(classInstance.className),
      ),
    [projectClasses],
  );

  const entityStylesEl = useProjectHeaderStyles(entityClasses);
  const sharedStylesEl = useProjectHeaderStyles(sharedClasses);
  const showGrid = useSelector(selectShowingGrid);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);
  const isImportLoader = useSelector(selectImportLoader);
  const styles = useStyles();

  return isImportLoader ? (
    <div className={styles.loader}>
      <CircularProgress size={80} />
    </div>
  ) : (
    <Frame
      ref={ref}
      {...props}
      head={<CustomHead />}
      height="100%"
      width="100%"
      frameBorder={0}
      scrolling="no"
      id={ELEMENT_IDS.canvas}
    >
      <FrameContextConsumer>
        {({ document: frameDocument, window: frameWindow }) => {
          const cache = createCache({
            key: `iframe-demo-${theme.direction}`,
            prepend: true,
            container: frameDocument.head,
            stylisPlugins: theme.direction === 'rtl' ? [rtlPlugin] : [],
          });

          const jss = create({
            plugins: [...jssPreset().plugins],
            insertionPoint: frameDocument.head,
          });

          frameDocument.head.prepend(entityStylesEl);
          frameDocument.head.append(sharedStylesEl);

          return (
            <>
              {showGrid ? (
                freeCanvasMode ? (
                  <GridLines className="grid-area" cellWidth={100}>
                    <DndFrame>
                      <WindowProvider value={frameWindow}>
                        <StylesProvider jss={jss}>
                          <StyleSheetManager
                            target={frameDocument.head}
                            stylisPlugins={
                              theme.direction === 'rtl' ? [rtlPluginSc] : []
                            }
                          >
                            <ThemeProvider theme={theme}>
                              <CacheProvider value={cache}>
                                {children}
                              </CacheProvider>
                            </ThemeProvider>
                          </StyleSheetManager>
                        </StylesProvider>
                      </WindowProvider>
                    </DndFrame>
                  </GridLines>
                ) : (
                  <GridLines
                    className="grid-area"
                    cellWidth={60}
                    strokeWidth={2}
                    cellWidth2={12}
                  >
                    <DndFrame>
                      <WindowProvider value={frameWindow}>
                        <StylesProvider jss={jss}>
                          <StyleSheetManager
                            target={frameDocument.head}
                            stylisPlugins={
                              theme.direction === 'rtl' ? [rtlPluginSc] : []
                            }
                          >
                            <ThemeProvider theme={theme}>
                              <CacheProvider value={cache}>
                                {children}
                              </CacheProvider>
                            </ThemeProvider>
                          </StyleSheetManager>
                        </StylesProvider>
                      </WindowProvider>
                    </DndFrame>
                  </GridLines>
                )
              ) : (
                <DndFrame>
                  <WindowProvider value={frameWindow}>
                    <StylesProvider jss={jss}>
                      <StyleSheetManager
                        target={frameDocument.head}
                        stylisPlugins={
                          theme.direction === 'rtl' ? [rtlPluginSc] : []
                        }
                      >
                        <ThemeProvider theme={theme}>
                          <CacheProvider value={cache}>
                            {children}
                          </CacheProvider>
                        </ThemeProvider>
                      </StyleSheetManager>
                    </StylesProvider>
                  </WindowProvider>
                </DndFrame>
              )}
            </>
          );
        }}
      </FrameContextConsumer>
    </Frame>
  );
};

export default FrameWrapper;
