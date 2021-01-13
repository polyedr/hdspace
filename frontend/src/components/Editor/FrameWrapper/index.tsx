import React, { FC, useEffect, useRef } from 'react';
import { create } from 'jss';
import {
  withStyles,
  jssPreset,
  StylesProvider,
} from '@material-ui/core/styles';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { NoSsr } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import { setEditorDocument } from '@Redux/project/actions';

const styles = () => ({
  root: {
    border: 'none',
  },
});

const CustomHead: FC = () => {
  return (
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
          html, body {
            padding: 0;
            margin: 0;
          }
          .frame-root, .frame-content {}
        `}
      </style>
    </>
  );
};

export const FrameWrapperFC: FC = ({ children, ...props }) => {
  const dispatch = useDispatch();

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      dispatch(setEditorDocument(ref.current.node.contentDocument));
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
    >
      <FrameContextConsumer>
        {({ document }) => {
          const jss = create({
            plugins: [...jssPreset().plugins],
            insertionPoint: document.head,
          });
          return <StylesProvider jss={jss}>{children}</StylesProvider>;
        }}
      </FrameContextConsumer>
    </Frame>
  );
};

class DemoFrame extends React.Component<
  { theme: any; classes: any; setEditorDocument: any },
  { ready: boolean; jss: any; sheetsManager: any; container: any }
> {
  private contentDocument: any;

  private contentWindow: any;

  // eslint-disable-next-line react/state-in-constructor
  state = {
    ready: false,
    jss: undefined,
    sheetsManager: undefined,
    container: null,
  };

  handleRef = (ref) => {
    this.contentDocument = ref ? ref.node.contentDocument : null;
    this.contentWindow = ref ? ref.node.contentWindow : null;
  };

  onContentDidMount = () => {
    this.setState({
      ready: true,
      jss: create({
        plugins: [...jssPreset().plugins],
        insertionPoint: this.contentWindow['jss-insertion-point'],
      }),
      sheetsManager: new Map(),
      container: this.contentDocument.body,
    });

    // eslint-disable-next-line react/destructuring-assignment
    this.props.setEditorDocument(this.contentDocument);
  };

  render() {
    const { children, classes } = this.props;
    const { ready, container, sheetsManager, jss } = this.state;

    // NoSsr fixes a strange concurrency issue with iframe and quick React mount/unmount
    return (
      <NoSsr>
        <Frame
          ref={this.handleRef}
          className={classes.root}
          contentDidMount={this.onContentDidMount}
          head={
            <style>
              {`
                html, body, .frame-root, .frame-content {
                  height: 100%;
                  box-sizing: border-box;
                  padding: 0;
                  margin: 0;
                }
              `}
            </style>
          }
          height="100%"
          width="100%"
        >
          <div id="jss-insertion-point" />
          {ready ? (
            <StylesProvider jss={jss} sheetsManager={sheetsManager}>
              {/* @ts-ignore */}
              {React.cloneElement(children, {
                container,
              })}
            </StylesProvider>
          ) : null}
        </Frame>
      </NoSsr>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(null, { setEditorDocument })(DemoFrame),
);
