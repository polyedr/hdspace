// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { ParagraphRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles(
  {
    paragraph: {
      outline: 0,
    },
  },
  [],
  {
    wordBreak: 'break-word',
  },
);

const Paragraph: React.FC<ParagraphRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, className, contentEditable } = props;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <p
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          classes.paragraph,
          classes.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        contentEditable={contentEditable}
        {...eventHandlers}
        dangerouslySetInnerHTML={{ __html: params.textContent }}
      />
    );
  },
);

export default Paragraph;
