import React, { FC, useEffect, useRef, useContext } from 'react';
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
import { selectCurrentUIFramework } from '@Redux/project/selectors/screen';
import { selectImportLoader } from '../../../redux/project/selectors/base';

import { WindowProvider } from './FrameContext';

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
        `}
      </style>
      {frameworkVersion && (
        <>
          {frameworkVersion.styleSheetsData.map(
            ({ key, link, ...otherParams }) => {
              return (
                <link
                  key={key}
                  rel="stylesheet"
                  type="text/css"
                  href={link}
                  {...otherParams}
                />
              );
            },
          )}
          {frameworkVersion.scriptsData.map(({ key, link, ...otherParams }) => (
            <script
              key={key}
              type="text/javascript"
              src={link}
              {...otherParams}
            />
          ))}
          {uiFramework.themingVariables && (
            <style type="text/css">
              {`:root {
              ${Object.keys(uiFramework.themingVariables).map((varName) => {
                return `--${varName}:${uiFramework.themingVariables[varName]};`;
              })}
          }`}
            </style>
          )}
        </>
      )}
    </>
  );
};

const DndFrame = ({ children }) => {
  const styles = useStyles();
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);
  const isImportLoader = useSelector(selectImportLoader);

  useEffect(() => {
    console.log('ADD EVENT LISTENERS!!');
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

  return (
    <Frame
      ref={ref}
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
