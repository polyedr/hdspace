// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { ImageRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles();

const Image: React.FC<ImageRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, className } = props;
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <img
      ref={ref}
      src={params.imageURL}
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
      alt={id}
      {...eventHandlers}
    />
  );
});

export default Image;
