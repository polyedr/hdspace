// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { TextBlockRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles(
  {
    textBlock: {
      outline: 0,
    },
  },
  [],
  {
    wordBreak: 'break-word',
  },
);

const TextBlock: React.FC<TextBlockRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      params,
      className,
      contentEditable,
      entityClass,
      groupClass,
    } = props;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        contentEditable={contentEditable}
        className={cn(
          className,
          classes.textBlock,
          entityClass,
          groupClass,
          classes.addedElem,
          classes.ownStyles,
        )}
        {...eventHandlers}
        dangerouslySetInnerHTML={{ __html: params.textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default TextBlock;
