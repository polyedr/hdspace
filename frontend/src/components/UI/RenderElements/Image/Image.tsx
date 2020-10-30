// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { ImageRendererProps } from '../types';
import makeElementStyles from '../styles';

const useStyles = makeElementStyles();

const Image: React.FC<ImageRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, className } = props;
  const classes = useStyles();

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
    />
  );
});

export default Image;
