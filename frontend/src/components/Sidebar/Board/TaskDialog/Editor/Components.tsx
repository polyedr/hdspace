// @ts-nocheck
import React, { Ref, PropsWithChildren } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ReactDOM from 'react-dom';
import { cx, css } from '@emotion/css';
import { styled, IconButton as MuiIconButton } from '@mui/material';
import { useFocused, useSelected, useSlate } from 'slate-react';
import { Text } from 'slate';
import escapeHtml from 'escape-html';
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from './helpers';
import { TEXT_ALIGN_TYPES } from './constants';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

export const Mention = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      {children}@{element.character}
    </span>
  );
};

export const serialize = (node: Descendant) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.code) {
      string = <code>{string}</code>;
    }

    if (node.bold) {
      string = <strong>{string}</strong>;
    }

    if (node.italic) {
      string = <em>{string}</em>;
    }

    if (node.underline) {
      string = <u>{string}</u>;
    }

    if (node.strikethrough) {
      string = <s>{string}</s>;
    }

    return string;
  }

  if (node.type === 'mention') {
    return <strong>@{node.character}</strong>;
  }

  const children = node.children.map((n) => serialize(n));

  switch (node.type) {
    case 'block-quote':
      return <blockquote>{children}</blockquote>;
    case 'bulleted-list':
      return <ul>{children}</ul>;
    case 'heading-one':
      return <h1>{children}</h1>;
    case 'heading-two':
      return <h2>{children}</h2>;
    case 'list-item':
      return <li>{children}</li>;
    case 'code':
      return <code>{children}</code>;
    case 'numbered-list':
      return <ol>{children}</ol>;
    case 'link':
      return <a href={escapeHtml(node.url)}>${children}</a>;
    default:
      return <p>{children}</p>;
  }
};

export const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'mention':
      return <Mention {...{ attributes, children, element }} />;
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

export const SendButton = styled(SendIcon)({
  color: '#81818E',
});

export const Leaf = ({ attributes, children, leaf }) => {
  let content = children;

  if (leaf.bold) {
    content = <strong>{content}</strong>;
  }

  if (leaf.code) {
    content = <code>{content}</code>;
  }

  if (leaf.italic) {
    content = <em>{content}</em>;
  }

  if (leaf.underline) {
    content = <u>{content}</u>;
  }

  if (leaf.strikethrough) {
    content = <s>{content}</s>;
  }

  return <span {...attributes}>{content}</span>;
};

export const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <IconButton
      style={
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
        )
          ? { color: '#000' }
          : {}
      }
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </IconButton>
  );
};

export const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <IconButton
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      style={isMarkActive(editor, format) ? { color: '#000' } : {}}
    >
      <Icon>{icon}</Icon>
    </IconButton>
  );
};

export const IconButton = styled(MuiIconButton)({
  display: 'inline-flex !important',
  padding: 3,

  '& .material-icons': {
    fontSize: 20,
  },

  '& span': {
    // color: '#81818E',
    margin: 0,
  },
});

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc'};
        `,
      )}
    />
  ),
);

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any;
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>,
  ) => {
    const textLines = value.document.nodes
      .map((node) => node.text)
      .toArray()
      .join('\n');
    return (
      <div
        ref={ref}
        {...props}
        className={cx(
          className,
          css`
            margin: 30px -20px 0;
          `,
        )}
      >
        <div
          className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Slate's value as text
        </div>
        <div
          className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
        >
          {textLines}
        </div>
      </div>
    );
  },
);

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>,
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        'material-icons',
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `,
      )}
    />
  ),
);

export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>,
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `,
      )}
    />
  ),
);

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>,
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }

          & > * + * {
            margin-left: 10px;
          }
        `,
      )}
    />
  ),
);

export const Portal = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>,
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          // padding: 1px 18px 17px;
          // margin: 0 -20px;
          // border-bottom: 2px solid #eee;
          // margin-bottom: 20px;
        `,
      )}
    />
  ),
);
