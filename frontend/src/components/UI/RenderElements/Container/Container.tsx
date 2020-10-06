/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ContainerRendererProps } from '../types';

const styles = require('../styles.scss');

const Container: React.FC<ContainerRendererProps> = React.forwardRef(
  (
    {
      id,
      entityStyles,
      groupStyles,
      ownStyles,
      isDisabled,
      children,
      className,
      isBorderVisible,
    },
    ref: React.RefObject<HTMLElement>,
  ) => {
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
          ref={ref}
          id={id}
          data-ls-id={id}
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
        >
          {children}
        </div>
      </>
    );
  },
);

export default Container;
