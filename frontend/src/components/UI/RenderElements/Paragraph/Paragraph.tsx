// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { ParagraphRendererProps } from '../types';

const useStyles = makeComponentStyles();

const Paragraph: React.FC<ParagraphRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, className } = props;
    const classes = useStyles(props);

    return (
      <p
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          classes.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        style={{ wordBreak: 'break-word' }}
      >
        {params.textContent}
      </p>
    );
  },
);

export default Paragraph;
