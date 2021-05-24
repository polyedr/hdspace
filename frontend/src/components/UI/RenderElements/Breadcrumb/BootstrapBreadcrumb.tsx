import React from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const BootstrapBreadcrumb = React.forwardRef<HTMLElement, RendererProps>(
  (props) => {
    const { children, element } = props;
    const [groupClass] = element.styles.classNames;

    const useStyles = makeComponentStyles('breadcrumb', {});
    const classes = useStyles(props);

    return (
      <nav
        aria-label="breadcrumb"
        className={cn(classes.ownStyles, groupClass)}
      >
        <ol className="breadcrumb">{children}</ol>
      </nav>
    );
  },
);

export default BootstrapBreadcrumb;
