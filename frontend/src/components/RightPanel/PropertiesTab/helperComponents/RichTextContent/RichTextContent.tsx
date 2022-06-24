import React, { useEffect, useState } from 'react';
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
import { RichUtils, DraftHandleValue } from 'draft-js';
import { getSelectedBlocksType } from 'draftjs-utils';
import {
  Commands,
  SelectedBlocks,
} from '@Components/RightPanel/PropertiesTab/helperComponents/RichTextContent/constants';

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

  const [editorState, handleEditorState] = useState(textState.editor);

  useEffect(() => {
    handleChange(editorState);
  }, [editorState]);

  useEffect(() => {
    handleEditorState(textState.editor);
  }, [textState.id]);

  const [selectedBlock, setSelectedBlock] = useState<string>('');

  useEffect(() => {
    setSelectedBlock(getSelectedBlocksType(editorState));
  }, [editorState]);

  const handleKeyCommand = (command: string): DraftHandleValue => {
    if (
      command === Commands.SPLIT_BLOCK &&
      selectedBlock !== SelectedBlocks.ORDERED_LIST_ITEM &&
      selectedBlock !== SelectedBlocks.UNORDERED_LIST_ITEM
    ) {
      handleChange(RichUtils.insertSoftNewline(editorState));
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <div className="editor" onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={handleEditorState}
        plugins={plugins}
        handleKeyCommand={handleKeyCommand}
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
