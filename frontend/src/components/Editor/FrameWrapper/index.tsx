import React, { FC, useEffect, useRef, useContext } from 'react';
import { create } from 'jss';
import {
  jssPreset,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/core/styles';
import Frame, {
  FrameContext,
  FrameContextConsumer,
} from 'react-frame-component';
import { useDispatch } from 'react-redux';
import { DndContext } from 'react-dnd';
import { setEditorDocument } from '@Redux/project/actions';
import theme from '@Src/styles/Theme';

import { WindowProvider } from './FrameContext';

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
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);

  useEffect(() => {
    (dragDropManager?.getBackend() as any)?.addEventListeners(window);
  });

  return children;
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
