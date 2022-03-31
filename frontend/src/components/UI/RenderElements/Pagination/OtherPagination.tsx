import React, { LegacyRef } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { useSelector } from 'react-redux';

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
        <a href={isPrototypeMode ? '!#' : 'javascript:void()'}  >&laquo;</a>
        {children}
        <a href={isPrototypeMode ? '!#' : 'javascript:void()'} >&raquo;</a>
      </div>
    );
  },
);

export default OtherPagination;
