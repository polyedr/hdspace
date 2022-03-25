import React from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const BootstrapBreadcrumb = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;

    const useStyles = makeComponentStyles('breadcrumb', {});
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn(
          classes.ownStyles,
          groupClass,
          !isDisabled && classes.ownPseudoStyles,
        )}
        id={element.id}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        <ol className="breadcrumb">{children}</ol>
      </nav>
    );
  },
);

export default BootstrapBreadcrumb;
