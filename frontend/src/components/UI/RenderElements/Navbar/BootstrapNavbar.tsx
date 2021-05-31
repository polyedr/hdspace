import React, { LegacyRef } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const BootstrapNavbar = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const {
      parameters: { titleName, titleLink },
    } = element;
    const [groupClass] = element.styles.classNames;

    const useStyles = makeComponentStyles('navbar', {});
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <nav
        ref={ref as LegacyRef<HTMLAnchorElement>}
        className={cn(
          'navbar-expand-sm navbar-light bg-light',
          classes.ownStyles,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        aria-label="navbar"
        id={element.id}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href={titleLink}>
            {titleName}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">{children}</div>
          </div>
        </div>
      </nav>
    );
  },
);

export default BootstrapNavbar;
