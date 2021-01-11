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
      '&:hover': {
        cursor: 'initial',
      },
    },
  },
  [],
  {
    wordBreak: 'break-word',
  },
);

const Paragraph: React.FC<ParagraphRendererProps> = React.forwardRef(
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

    // console.log('ENTITY CLASS!!', entityClass);
    // console.log('GROUP CLASS!!', groupClass);

    return (
      <p
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          entityClass,
          classes.ownStyles,
          className,
          classes.paragraph,
          classes.addedElem,
          groupClass,
        )}
        contentEditable={contentEditable}
        {...eventHandlers}
        dangerouslySetInnerHTML={{ __html: params.textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default Paragraph;
