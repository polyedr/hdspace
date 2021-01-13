import React from 'react';
import { create } from 'jss';
import {
  withStyles,
  jssPreset,
  StylesProvider,
} from '@material-ui/core/styles';
import Frame from 'react-frame-component';
import { NoSsr } from '@material-ui/core';
import { connect } from 'react-redux';
import { setEditorDocument } from '@Redux/project/actions';

const styles = () => ({
  root: {
    border: 'none',
  },
});

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
