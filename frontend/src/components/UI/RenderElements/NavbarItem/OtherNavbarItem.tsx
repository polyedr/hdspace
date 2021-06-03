import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('breadcrumb', {});

const OtherNavbarItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element } = props;
    const [groupClass] = element.styles.classNames;
    const { itemName, link } = element.parameters;
    const classes = useStyles(props);

    return (
      <>
        <a
          ref={ref as LegacyRef<HTMLAnchorElement>}
          href={link}
          className={cn('nav-link', classes.ownStyles, groupClass)}
          aria-label={`Link-${element.id}`}
          rel="noreferrer"
          target="_blank"
        >
          {itemName}
        </a>
      </>
    );
  },
);

export default OtherNavbarItem;
