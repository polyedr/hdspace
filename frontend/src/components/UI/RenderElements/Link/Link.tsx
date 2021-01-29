import React from 'react';
import { useHistory } from 'react-router';
import cn from 'classnames';
import { ActionRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('link');

const Link = React.forwardRef<HTMLAnchorElement, ActionRendererProps>(
  (props, ref) => {
    const { id, isDisabled, params, className, groupClass } = props;
    const { textContent, action } = params;

    const history = useHistory();

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props, {
      onClick: (event) => {
        if (isDisabled) {
          event.stopPropagation();
          event.preventDefault();
          return;
        }
        if (
          action.type === 'internal-link' &&
          action.screenId &&
          action.screenId !== 'noScreen'
        ) {
          event.stopPropagation();
          event.preventDefault();
          history.push(action.screenId);
        }
      },
    });

    return (
      <a
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          groupClass,
          isDisabled && classes.disabled,
          classes.ownStyles,
        )}
        href={action.url}
        target={action.type === 'external-link' ? '_blank' : '_parent'}
        {...eventHandlers}
      >
        {textContent}
      </a>
    );
  },
);

export default Link;
