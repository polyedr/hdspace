import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import hljs from 'highlight.js/lib/core';
import cn from 'classnames';
import { makeStyles } from '@mui/styles';
import Scrollbar from '../Scrollbar';
import CSSValidator from './CSSValidator';
import { ValidationError, Validator } from './validator';

interface CodeEditorProps {
  value: string;
  setValue: (newValue: string) => void;
  width?: string;
  height?: string;
  padding?: string;
  borderRadius?: string;
  language: 'html' | 'js' | 'css' | string;
  caretColor?: string;
  tabSize?: 1 | 2 | 3 | 4 | 5 | 6;
}

const useStyles = makeStyles({
  container: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b2b2b',
    overflow: 'hidden',
  },
  editor: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
    padding: '1rem',
    '&::-webkit-scrollbar-corner': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar': {
      backgroundColor: 'transparent',
      width: '5px',
      height: '5px',
    },

    '&::-webkit-scrollbar-thumb': {
      background: '#5c5c5c',
    },
  },
  editorCode: {
    padding: '0.5rem !important',
    fontSize: '1em',
    margin: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden !important',
    boxSizing: 'border-box',
    scrollbarColor: '#5c5c5c transparent',
    scrollbarWidth: 'thin',
  },
  editorTextarea: {
    top: 0,
    border: 'none',
    whiteSpace: 'pre',
    resize: 'none',
    position: 'absolute',
    color: 'transparent',
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none',
    },
  },
  error: {
    textDecoration: 'underline wavy red',
  },
});

function CodeEditorEditable({
  width = '500px',
  height = '500px',
  padding = '0',
  borderRadius = '0',
  value,
  setValue,
  language,
  caretColor = 'red',
  tabSize = 2,
}: CodeEditorProps): ReactElement {
  const [caretPos, setCaretPos] = useState(0);
  const validator = useRef<Validator>(new CSSValidator());

  const wrapperRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const classes = useStyles();

  const handleScroll = (e: React.UIEvent<HTMLElement>): void => {
    const eventTarget = e.target as Element;
    if (codeBlockRef.current) {
      codeBlockRef.current.scroll(
        eventTarget.scrollLeft,
        eventTarget.scrollTop,
      );
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const { value: newStyles } = e.target;
    setValue(newStyles);
  };

  const setCaretPosition = (ctrl: HTMLTextAreaElement, pos: number): void => {
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((ctrl as any).createTextRange) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const range = (ctrl as any).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const myField = textAreaRef.current;
    const myValue = Math.random()
      .toString(32)
      .substring(0, tabSize)
      .replace(/./g, ' ');

    if (e.key === 'Tab') {
      e.preventDefault();
      if (myField?.selectionStart || myField?.selectionStart === 0) {
        const startPos = myField.selectionStart;
        const endPos = myField.selectionEnd;
        setCaretPos(startPos + myValue.length);

        const newValue =
          myField.value.substring(0, startPos) +
          myValue +
          myField.value.substring(endPos, myField.value.length);

        setValue(newValue);
      }
    }
  };

  useLayoutEffect(() => {
    if (caretPos !== 0 && textAreaRef.current) {
      setCaretPosition(textAreaRef.current, caretPos);
      setCaretPos(0);
    }
  }, [caretPos]);

  const handleErrors = useCallback(
    (errors: ValidationError[]) => {
      errors.forEach((error) => {
        if (codeBlockRef.current === null) {
          return;
        }
        codeBlockRef.current.innerHTML =
          codeBlockRef.current.innerHTML.replaceAll(
            error.keyPart,
            `<span class="${classes.error}">${error.keyPart}</span>`,
          );
      });
    },
    [classes.error],
  );

  useEffect(() => {
    if (codeBlockRef.current) {
      hljs.highlightBlock(codeBlockRef.current);
      const errors = validator.current.validate(value);
      if (errors.length) {
        handleErrors(errors);
      }
    }
  }, [handleErrors, value]);

  return (
    <div
      className={cn('hljs', classes.container)}
      style={{ width, height, padding, borderRadius }}
      ref={wrapperRef}
    >
      <pre className={cn(classes.editor)}>
        <Scrollbar
          autoHeightMin="100%"
          autoHeightMax={
            wrapperRef.current
              ? `calc(${
                  wrapperRef.current.getBoundingClientRect().height
                }px - 1rem)`
              : '100%'
          }
        >
          <code
            ref={codeBlockRef}
            className={cn(classes.editorCode, `language-${language}`)}
          >
            {`${value}\n\r`}
          </code>

          <textarea
            value={value}
            spellCheck="false"
            ref={textAreaRef}
            className={cn(classes.editorCode, classes.editorTextarea)}
            onScroll={handleScroll}
            onChange={handleChange}
            maxLength={3000}
            onKeyDown={handleKeyDown}
            style={{
              msScrollbarBaseColor: 'violet',
              scrollbarWidth: 'thin',
              caretColor,
              height: wrapperRef.current
                ? `calc(${
                    wrapperRef.current.getBoundingClientRect().height
                  }px - 1rem)`
                : '100%',
            }}
          />
        </Scrollbar>
      </pre>
    </div>
  );
}

export default CodeEditorEditable;
