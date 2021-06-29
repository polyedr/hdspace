import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RichTextEditor from 'react-rte';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';

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

  const toolbarConfig: any = {
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD' },
      { label: 'Italic', style: 'ITALIC' },
      { label: 'Underline', style: 'UNDERLINE' },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: 'UL', style: 'unordered-list-item' },
      { label: 'OL', style: 'ordered-list-item' },
    ],
  };

  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }

  return (
    <RichTextEditor
      value={state}
      onChange={handleChange}
      toolbarConfig={toolbarConfig}
      editorClassName={classes.editor}
      disabled={!canEdit}
    />
  );
};

export default TextContent;
