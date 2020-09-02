/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ClockRendererProps } from '../types';
import ClockWidget from '../../Clock';

const styles = require('../styles.scss');

const Clock: React.FC<ClockRendererProps> = ({
  id,
  params,
  entityStyles,
  groupStyles,
  ownStyles,
  sortableId,
  isDisabled,
  className,
  elementRef,
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

  return (
    <div
      ref={elementRef}
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
      tabIndex={isDisabled ? 0 : -1}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
};

export default Clock;
