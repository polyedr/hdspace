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
      sortableId,
      entityStyles,
      groupStyles,
      ownStyles,
      isDisabled,
      children,
      className,
      isBorderVisible,
    },
    ref,
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

    return (
      <>
        <section
          ref={ref}
          id={id}
          data-ls-id={id}
          data-id={sortableId}
          key={id}
          className={cn(
            className,
            styles.addedElem,
            classes.entityStyles,
            classes.groupStyles,
            classes.ownStyles,
          )}
          style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
        >
          {children}
        </section>
      </>
    );
  },
);

export default Container;
