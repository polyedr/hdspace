import React from 'react';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

const TextEditor = ({ textState, handleChange }) => {
  const editor = React.useRef(null);
  const focusEditor = () => {
    // @ts-ignore
    editor.current.focus();
  };

  return (
    <div
      style={{ border: '1px solid black', minHeight: '6em', cursor: 'text' }}
      onClick={focusEditor}
    >
      <Editor
        ref={editor}
        editorState={textState}
        onChange={handleChange}
        plugins={plugins}
      />
      <Toolbar />
    </div>
  );
};

export default TextEditor;
