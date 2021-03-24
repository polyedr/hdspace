import React from 'react';
import cn from 'classnames';
import { ImageRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('image');

const Image = React.forwardRef<HTMLImageElement, ImageRendererProps>(
  (props, ref) => {
    const { id, params, className, groupClass } = props;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <img
        ref={ref}
        src={params.imageURL}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(className, groupClass, classes.ownStyles)}
        alt={params.alt}
        title={params.title}
        draggable={false}
        {...eventHandlers}
      />
    );
  },
);

export default Image;
