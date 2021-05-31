import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('breadcrumb', {});

const BootstrapNavbarItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element } = props;
    const [groupClass] = element.styles.classNames;
    const { nameItem, link } = element.parameters;
    const classes = useStyles(props);

    return (
      <>
        <a
          ref={ref as LegacyRef<HTMLAnchorElement>}
          className={cn('nav-link', classes.ownStyles, groupClass)}
          aria-label={`Link-${element.id}`}
          target="_blank"
          rel="noreferrer"
          href={link}
        >
          {nameItem}
        </a>
      </>
    );
  },
);

export default BootstrapNavbarItem;
