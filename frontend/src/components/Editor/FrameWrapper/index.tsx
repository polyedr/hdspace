import React, { FC, useEffect, useRef } from 'react';
import { create } from 'jss';
import {
  jssPreset,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/core/styles';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useDispatch } from 'react-redux';
import { setEditorDocument } from '@Redux/project/actions';
import theme from '@Src/styles/Theme';

const CustomHead: FC = () => (
  <>
    <meta charSet="utf-8" />
    <title>Previewer</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <base target="_parent" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
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

export const FrameWrapper: FC<any> = ({ children, ...props }) => {
  const dispatch = useDispatch();

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      dispatch(setEditorDocument(ref.current.node.contentDocument));
    }
  }, [dispatch]);

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
        {({ document }) => {
          const jss = create({
            plugins: [...jssPreset().plugins],
            insertionPoint: document.head,
          });
          return (
            <StylesProvider jss={jss}>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </StylesProvider>
          );
        }}
      </FrameContextConsumer>
    </Frame>
  );
};

export default FrameWrapper;
