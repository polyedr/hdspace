import React, { LegacyRef } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('pagination', {
  pagination: {
    display: 'inline-block',
    '& a': {
      color: 'black',
      float: 'left',
      padding: '8px 16px',
      textDecoration: 'none',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#ddd',
      },
    },
  },
  active: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
});

const OtherPagination = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const classes = useStyles(props);

    const eventHandlers = useEventHandlers(props);
    return (
      // <nav
      //   ref={ref}
      //   id={element.id}
      //   data-ls-id={element.id}
      //   aria-label="Page navigation example"
      //   className={cn(classes.ownStyles, groupClass)}
      //   {...eventHandlers}
      // >
      //   {children}
      // </nav>
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          groupClass,
          classes.pagination,
        )}
        {...eventHandlers}
      >
        <a href="!#">&laquo;</a>
        {children}
        <a href="!#">&raquo;</a>
      </div>
    );
  },
);

export default OtherPagination;
