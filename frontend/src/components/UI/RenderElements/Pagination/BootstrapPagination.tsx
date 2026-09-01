import React from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const BootstrapPagination = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;

    const useStyles = makeComponentStyles('pagination', {});
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <nav
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        aria-label="Page navigation example"
        className={cn(
          classes.ownStyles,
          groupClass,
          !isDisabled && classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="!#">
              <span>Previous</span>
            </a>
          </li>
          {children}
          <li className="page-item">
            <a className="page-link" href="!#">
              <span>Next</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  },
);

export default BootstrapPagination;
