import React, { useRef } from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

type Size = {
  width: number;
  height: number;
};

const useStyles = makeComponentStyles('image');

const Image = React.forwardRef<HTMLImageElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { imageURL, alt, title } = element?.parameters;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    const imgRef = useRef<HTMLImageElement | null>(null);

    return isDisabled ? (
      <img
        ref={(dom: HTMLImageElement) => {
          if (typeof ref === 'function') {
            ref(dom);
          } else if (ref) {
            ref.current = dom;
          }
          imgRef.current = dom;
        }}
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
    ) : (
      <img
        ref={ref}
        src={imageURL}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          !isDisabled && classes.ownPseudoStyles,
        )}
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
