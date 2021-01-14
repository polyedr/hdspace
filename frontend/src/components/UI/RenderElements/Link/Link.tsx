// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MaterialLink } from '@material-ui/core';
import { ActionRendererProps } from '../types';
import { WithActionProps } from '../../../../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

export type LinkRenderer = React.FC<WithActionProps & ActionRendererProps>;

const useStyles = makeComponentStyles('link');

const Link: LinkRenderer = React.forwardRef((props, ref) => {
  const {
    id,
    isDisabled,
    params,
    actionType,
    actionLink,
    className,
    groupClass,
  } = props;
  const { textContent } = params;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <MaterialLink
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
      underline={isDisabled ? 'none' : 'hover'}
      {...(actionType === 'external-link' && {
        href: actionLink,
        target: '_blank',
      })}
      {...(actionType === 'internal-link' && {
        component: RouterLink,
        to: actionLink,
      })}
      {...eventHandlers}
    >
      {textContent}
    </MaterialLink>
  );
});

export default Link;
