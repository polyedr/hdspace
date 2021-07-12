import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RichTextEditor from 'react-rte';
import EditorToolbarConfig from './EditorToolbarConfig';

const useStyles = makeStyles(({ palette }) => ({
  editor: {
    fontFamily: 'Roboto',
    backgroundColor: palette.panel.main,
    borderBottom: `1px solid ${palette.grey.A200}`,
  },
  toolbar: {
    backgroundColor: palette.panel.main,
    margin: '0 !important',
    border: 'none !important',
  },
  container: {
    border: 'none !important',
  },
}));

const RichTextContent = ({ canEdit, state, handleChange }) => {
  const classes = useStyles();

  return (
    <RichTextEditor
      editorClassName={classes.editor}
      toolbarClassName={classes.toolbar}
      className={classes.container}
      value={state || ''}
      onChange={handleChange}
      toolbarConfig={EditorToolbarConfig}
      disabled={!canEdit}
    />
  );
};

export default RichTextContent;
