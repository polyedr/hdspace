import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('image');

const Image = React.forwardRef<HTMLImageElement, RendererProps>(
  (props, ref) => {
    const { element } = props;
    const [className, groupClass] = element.styles.classNames;
    const { imageURL, alt, title } = element.parameters;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <img
        ref={ref}
        src={imageURL}
        id={element.id}
        data-ls-id={element.id}
        className={cn(className, groupClass, classes.ownStyles)}
        alt={alt}
        title={title}
        draggable={false}
        loading="lazy"
        {...eventHandlers}
      />
    );
  },
);

export default Image;
