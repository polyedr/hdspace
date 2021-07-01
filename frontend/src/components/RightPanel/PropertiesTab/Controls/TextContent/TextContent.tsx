import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RichTextEditor from 'react-rte';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';
import EditorToolbarConfig from './EditorToolbarConfig';

const useStyles = makeStyles(({ palette }) => ({
  editor: {
    color: 'black',
    fontFamily: 'Roboto',
  },
  toolbar: {
    backgroundColor: palette.panel.main,
    margin: '0 !important',
  },
  container: {
    border: 'none !important',
    borderRadius: '0 !important',
  },
}));

const TextContent = ({ element, updateParams, canEdit }) => {
  const classes = useStyles();
  const { textContent } = element.parameters;

  const [state, handleChange] = useDebouncedRichInputChange(
    textContent,
    (value) => {
      updateParams({ textContent: value.toString('html') });
    },
  );

  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }

  return (
    <RichTextEditor
      editorClassName={classes.editor}
      toolbarClassName={classes.toolbar}
      className={classes.container}
      value={state}
      onChange={handleChange}
      toolbarConfig={EditorToolbarConfig}
      disabled={!canEdit}
    />
  );
};

export default TextContent;
