/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ContainerRendererProps } from '../types';

const styles = require('../styles.scss');

const Container: React.FC<ContainerRendererProps> = ({
  id,
  sortableId,
  entityStyles,
  groupStyles,
  ownStyles,
  isDisabled,
  children,
  className,
  elementRef,
  isBorderVisible,
}) => {
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

  const isRoot = id === 'root';

  return (
    <>
      <div
        ref={elementRef}
        id={id}
        data-ls-id={id}
        data-id={sortableId}
        key={id}
        className={cn(
          className,
          isRoot && styles.root,
          styles.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
        tabIndex={isDisabled ? 0 : -1}
      >
        {children}
      </div>
    </>
  );
};

export { Container };
