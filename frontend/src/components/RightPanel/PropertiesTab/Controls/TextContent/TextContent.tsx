import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RichTextEditor from 'react-rte';

const useStyles = makeStyles(() => ({
  editor: {
    color: 'black',
    fontFamily: 'Roboto',
  },
}));

const TextContent = ({ element, updateParams, canEdit }) => {
  const classes = useStyles();
  const { textContent } = element.parameters;

  const [state, handleChange] = useState(
    RichTextEditor.createValueFromString(textContent, 'html'),
  );

  const onChange = (value) => {
    handleChange(value);
    updateParams({ textContent: value.toString('html') });
  };

  const toolbarConfig: any = {
    display: ['INLINE_STYLE_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
      { label: 'Italic', style: 'ITALIC' },
      { label: 'Underline', style: 'UNDERLINE' },
    ],
  };

  useEffect(() => {
    handleChange(RichTextEditor.createValueFromString(textContent, 'html'));
  }, [textContent]);

  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }

  return (
    <RichTextEditor
      value={state}
      onChange={onChange}
      toolbarConfig={toolbarConfig}
      editorClassName={classes.editor}
      disabled={!canEdit}
    />
  );
};

export default TextContent;
