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
import { RichUtils, KeyBindingUtil } from 'draft-js';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

const RichTextContent = ({ textState, handleChange }) => {
  const editor = React.useRef<Editor | null>(null);
  const focusEditor = () => {
    if (editor.current !== null) {
      editor.current.focus();
    }
  };

  const handleReturn = (event) => {
    if (KeyBindingUtil.isSoftNewlineEvent(event)) {
      handleChange(RichUtils.insertSoftNewline(textState));
      return 'handled';
    }

    return 'not-handled';
  };

  return (
    <div className="editor" onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={textState}
        onChange={handleChange}
        plugins={plugins}
        handleReturn={(event) => handleReturn(event)}
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

export default RichTextContent;
