/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
// @ts-nocheck
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { Editable, withReact, Slate, ReactEditor } from 'slate-react';

import { Editor, Transforms, createEditor, Descendant, Range } from 'slate';
import { withHistory } from 'slate-history';

import { Grid, Divider } from '@mui/material';
import { EditableProps } from 'slate-react/dist/components/editable';
import { useSelector } from 'react-redux';
import fuzzysort from 'fuzzysort';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import {
  Toolbar,
  IconButton,
  SendButton,
  BlockButton,
  MarkButton,
  Leaf,
  Element,
  serialize,
} from './Components';
import { insertMention, withMentions } from './helpers';

export function RenderEditorHtml({ nodes }: { nodes: Descendant[] }) {
  return <>{nodes.map(serialize)}</>;
}

export function Portal({ children }) {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
}

const RichTextEditor = React.forwardRef(
  ({ onSubmit, onChange, value, ...props }: EditableProps, forwardRef) => {
    const ref = useRef<HTMLDivElement | null>();
    const [target, setTarget] = useState<Range | undefined>();
    const [index, setIndex] = useState(0);
    const [search, setSearch] = useState('');

    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(
      () => withMentions(withHistory(withReact(createEditor()))),
      [],
    );

    const userPermissions = useSelector(selectAllUsersPermissions);

    const handleOnChange = useCallback(
      (value: Descendant[]) => {
        if (editor.selection && Range.isCollapsed(editor.selection)) {
          const [start] = Range.edges(editor.selection);
          const wordBefore = Editor.before(editor, start, { unit: 'word' });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          }
        }

        setTarget(null);

        const isAstChange = editor.operations.some(
          (op) => op.type !== 'set_selection',
        );
        if (isAstChange) {
          onChange(value);
        }
      },
      [onChange, editor],
    );

    const users = useMemo(
      () => Object.values(userPermissions).map((u) => u.userData),
      [userPermissions],
    );

    const chars = useMemo(
      () =>
        fuzzysort
          .go(search, users, {
            keys: ['username', 'email', 'first_name', 'last_name'],
          })
          .map((r) => r.obj.username),
      [search],
    );

    const onKeyDown = useCallback(
      (event) => {
        if (target) {
          switch (event.key) {
            case 'ArrowDown':
              event.preventDefault();
              // eslint-disable-next-line no-case-declarations
              const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
              setIndex(prevIndex);
              break;
            case 'ArrowUp':
              event.preventDefault();
              // eslint-disable-next-line no-case-declarations
              const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
              setIndex(nextIndex);
              break;
            case 'Tab':
            case 'Enter':
              event.preventDefault();
              Transforms.select(editor, target);
              insertMention(editor, chars[index]);
              setTarget(null);
              break;
            case 'Escape':
              event.preventDefault();
              setTarget(null);
              break;
            default:
          }
        }
      },
      [index, search, target],
    );

    useEffect(() => {
      if (target && chars.length > 0) {
        const el = ref.current;
        const domRange = ReactEditor.toDOMRange(editor, target);
        const rect = domRange.getBoundingClientRect();
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }, [chars.length, editor, index, search, target]);

    return (
      <Slate
        onChange={handleOnChange}
        ref={forwardRef}
        editor={editor}
        value={value ?? initialValue}
      >
        <Editable
          {...props}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={onKeyDown}
        />
        <Grid container alignItems="center">
          <Grid item md={10}>
            <Toolbar>
              <MarkButton format="bold" icon="format_bold" />
              <MarkButton format="italic" icon="format_italic" />
              <MarkButton format="underline" icon="format_underlined" />
              <MarkButton format="strikethrough" icon="format_strikethrough" />
              <MarkButton format="code" icon="code" />
              {/* <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="block-quote" icon="format_quote" /> */}
              <Divider
                orientation="vertical"
                sx={{ height: 16, verticalAlign: 'middle' }}
              />
              <BlockButton format="numbered-list" icon="format_list_numbered" />
              <BlockButton format="bulleted-list" icon="format_list_bulleted" />
              {/* <BlockButton format="left" icon="format_align_left" />
            <BlockButton format="center" icon="format_align_center" />
            <BlockButton format="right" icon="format_align_right" />
            <BlockButton format="justify" icon="format_align_justify" /> */}
            </Toolbar>
          </Grid>
          <Grid
            item
            md={2}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            {onSubmit ? (
              <IconButton onClick={onSubmit}>
                <SendButton />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
        {target && chars.length > 0 && (
          <Portal>
            <div
              ref={ref}
              style={{
                top: '-9999px',
                left: '-9999px',
                position: 'absolute',
                zIndex: 100000,
                padding: '3px',
                background: 'white',
                borderRadius: '4px',
                boxShadow: '0 1px 5px rgba(0,0,0,.2)',
              }}
              data-cy="mentions-portal"
            >
              {chars.map((char, i) => (
                <div
                  onClick={() => {
                    Transforms.select(editor, target);
                    insertMention(editor, char);
                    setTarget(null);
                  }}
                  key={char}
                  style={{
                    padding: '4px 8px',
                    minWidth: 200,
                    borderRadius: '3px',
                    background: i === index ? '#B4D5FF' : 'transparent',
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
          </Portal>
        )}
      </Slate>
    );
  },
);

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export default RichTextEditor;
