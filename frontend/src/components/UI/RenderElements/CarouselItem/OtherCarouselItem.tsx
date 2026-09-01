import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('carousel-item', {
  mySlides: {
    display: 'none',
  },
});

const OtherCarouselItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element } = props;
    const [groupClass] = element.styles.classNames;
    const { link, alt } = element.parameters;
    const classes = useStyles(props);

    return (
      <img
        ref={ref as LegacyRef<HTMLImageElement>}
        id={element.id}
        data-ls-id={element.id}
        alt={alt}
        className={cn(
          'mySlides',
          classes.mySlides,
          classes.ownStyles,
          groupClass,
        )}
        src={link}
        style={{ width: '100%', height: '100%' }}
      />
    );
  },
);

export default OtherCarouselItem;
