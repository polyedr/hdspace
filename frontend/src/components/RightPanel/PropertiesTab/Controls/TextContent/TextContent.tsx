import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RichTextEditor from 'react-rte';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';
import EditorToolbarConfig from './EditorToolbarConfig';

const useStyles = makeStyles(() => ({
  editor: {
    color: 'black',
    fontFamily: 'Roboto',
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
      value={state}
      onChange={handleChange}
      toolbarConfig={EditorToolbarConfig}
      editorClassName={classes.editor}
      disabled={!canEdit}
    />
  );
};

export default TextContent;
