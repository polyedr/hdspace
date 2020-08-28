import React from 'react';
import cn from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MaterialLink, makeStyles } from '@material-ui/core';

import { WithActionProps } from '$utils/withAction';

import { ActionRendererProps } from '../types';

const styles = require('../styles.scss');

export type LinkRenderer = React.FC<WithActionProps & ActionRendererProps>;

const Link: LinkRenderer = ({
  id,
  entityStyles,
  groupStyles,
  ownStyles,
  isDisabled,
  params,
  onClick,
  sortableId,
  actionType,
  actionLink,
  className,
  elementRef,
}) => {
  const { textContent } = params;

  const classes = makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...ownStyles,
    },
  })();

  return (
    <MaterialLink
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        isDisabled && styles.disabled,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      underline={isDisabled ? 'none' : 'hover'}
      onClick={onClick}
      {...(actionType === 'external-link' && {
        href: actionLink,
        target: '_blank',
      })}
      {...(actionType === 'internal-link' && {
        component: RouterLink,
        to: actionLink,
      })}
    >
      {textContent}
    </MaterialLink>
  );
};

export default Link;
