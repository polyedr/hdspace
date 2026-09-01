import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('pagination', {
  pagination: {
    display: 'inline-block',
    '& a': {
      display: 'inline-block',
    },
    '& a span': {
      color: 'black',
      float: 'left',
      padding: '8px 16px',
      textDecoration: 'none',
      cursor: 'pointer',
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
    const isPrototypeMode = useSelector(selectIsPrototypeMode);
    const eventHandlers = useEventHandlers(props);
    return (
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          classes.ownStyles,
          !isDisabled && classes.ownPseudoStyles,
          groupClass,
          classes.pagination,
        )}
        {...eventHandlers}
      >
        <a
          href="!#"
          onClick={(e) => {
            if (!isPrototypeMode) {
              e.preventDefault();
            }
          }}
        >
          <span>&laquo;</span>
        </a>
        {children}
        <a
          href="!#"
          onClick={(e) => {
            if (!isPrototypeMode) {
              e.preventDefault();
            }
          }}
        >
          <span>&raquo;</span>
        </a>
      </div>
    );
  },
);

export default OtherPagination;
