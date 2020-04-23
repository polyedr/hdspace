import React from 'react';
import cn from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';

import { WithActionProps } from '$utils/withAction';

import { RendererProps } from '../types';
const styles = require('../styles.scss');

type Link = React.FC<WithActionProps & RendererProps>;

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
      className={cn('ls-item', isDisabled && styles.disabled, active && 'activated')}
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
