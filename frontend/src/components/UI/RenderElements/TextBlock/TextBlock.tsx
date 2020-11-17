// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { TextBlockRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

// const styles = require('../styles.scss');

const useStyles = makeComponentStyles({}, [], {
  wordBreak: 'break-word',
});

const TextBlock: React.FC<TextBlockRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, className, contentEditable } = props;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    console.log('CONTENT EDITABLE!!', contentEditable);

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        contentEditable={contentEditable}
        className={cn(
          className,
          classes.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        {params.textContent}
      </div>
    );
  },
);

export default TextBlock;
