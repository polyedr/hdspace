import React from 'react';
import cn from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';

import { WithActionProps } from '$utils/withAction';
import { sharedClasses } from '$styles/sharedClasses';

import { ActionRendererProps } from '../types';
const styles = require('../styles.scss');

type Link = React.FC<WithActionProps & ActionRendererProps>;

const LinkComponent: Link = (props) => {
  const {
    id,
    style,
    active,
    isDisabled,
    params,
    onClick,
    sortableId,
    actionType,
    actionLink,
  } = props;

  const { textContent } = params;

  return (
    <Link
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(sharedClasses.lsItem, isDisabled && styles.disabled, active && sharedClasses.activated)}
      style={style}
      underline={isDisabled ? 'none' : 'hover'}
      onClick={onClick}
      {...actionType === 'external-link' && { href: actionLink, target: '_blank' }}
      {...actionType === 'internal-link' && { component: RouterLink, to: actionLink }}
    >
      {textContent}
    </Link>
  );
}

export { LinkComponent as Link };
