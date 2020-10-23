// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { SharedRendererProps } from '../types';

const styles = require('../styles.scss');

const Undefined: React.FC<SharedRendererProps> = React.forwardRef(
  ({ id, entityStyles, groupStyles, ownStyles, className, children }, ref) => {
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
      <div
        ref={ref}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          styles.addedContainer,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
      >
        {children}
      </div>
    );
  },
);

export default Undefined;
