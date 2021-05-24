import React from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const BootstrapPagination = React.forwardRef<HTMLElement, RendererProps>(
  (props) => {
    const { children, element } = props;
    const [groupClass] = element.styles.classNames;

    const useStyles = makeComponentStyles('pagination', {});
    const classes = useStyles(props);

    return (
      <nav
        aria-label="Page navigation example"
        className={cn(classes.ownStyles, groupClass)}
      >
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="!#">
              Previous
            </a>
          </li>
          {children}
          <li className="page-item">
            <a className="page-link" href="!#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  },
);

export default BootstrapPagination;
