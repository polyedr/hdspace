import React from 'react';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import './styles.css';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
} from '@draft-js-plugins/buttons';

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
    <div className="editor" onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={textState}
        onChange={handleChange}
        plugins={plugins}
      />
      <Toolbar>
        {(externalProps) => (
          <div className="tool-bar">
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <CodeButton {...externalProps} />
            <UnorderedListButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <BlockquoteButton {...externalProps} />
          </div>
        )}
      </Toolbar>
    </div>
  );
};

export default TextEditor;
