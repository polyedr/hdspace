// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ClockRendererProps } from '../types';
import ClockWidget from '../../Clock';

const styles = require('../styles.scss');

const Clock: React.FC<ClockRendererProps> = React.forwardRef(
  (
    { id, params, entityStyles, groupStyles, ownStyles, sortableId, className },
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
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        data-id={sortableId}
        key={id}
        className={cn(
          className,
          styles.addedCalendar,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
      >
        <ClockWidget
          size={typeof params.width === 'number' ? params.width : undefined}
        />
      </div>
    );
  },
);

export default Clock;
