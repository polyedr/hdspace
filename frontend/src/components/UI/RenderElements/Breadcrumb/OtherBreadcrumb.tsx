import React, { LegacyRef } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('breadcrumb', {
  breadcrumb: {
    padding: '8px 0px',
    listStyle: 'none',
    backgroundColor: '#eee',
  },
});

const OtherBreadcrumb = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      // <nav
      //   ref={ref}
      //   aria-label="breadcrumb"
      //   className={cn(classes.ownStyles, groupClass)}
      //   id={element.id}
      //   data-ls-id={element.id}
      //   {...eventHandlers}
      // >
      //   <ol className="breadcrumb">{children}</ol>
      // </nav>
      <ul
        ref={ref as LegacyRef<HTMLUListElement>}
        className={cn(
          classes.breadcrumb,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          groupClass,
        )}
        id={element.id}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        {children}
      </ul>
    );
  },
);

export default OtherBreadcrumb;
