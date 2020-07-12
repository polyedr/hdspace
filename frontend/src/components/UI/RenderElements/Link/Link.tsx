import React from 'react';
import cn from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';

import { WithActionProps } from '$utils/withAction';

import { ActionRendererProps } from '../types';
const styles = require('../styles.scss');

export type LinkRenderer = React.FC<WithActionProps & ActionRendererProps>;

const LinkComponent: LinkRenderer = (props) => {
  const {
    id,
    style,
    isDisabled,
    params,
    onClick,
    sortableId,
    actionType,
    actionLink,
    className,
    elementRef,
  } = props;

  const { textContent } = params;

  return (
    <Link
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, isDisabled && styles.disabled)}
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
