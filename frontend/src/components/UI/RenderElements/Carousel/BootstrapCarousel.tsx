import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const BootstrapCarousel = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element } = props;
    const [groupClass] = element.styles.classNames;

    const useStyles = makeComponentStyles('breadcrumb', {});
    const classes = useStyles(props);

    return (
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        id="carouselExampleControls"
        className={cn(classes.ownStyles, groupClass, 'carousel slide')}
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">{children}</div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    );
  },
);

export default BootstrapCarousel;
