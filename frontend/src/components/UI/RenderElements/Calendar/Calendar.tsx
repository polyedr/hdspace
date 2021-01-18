// @ts-nocheck
import React from 'react';
import cn from 'classnames';
import CalendarWidget from '@Components/UI/Widgets/Calendar';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('clock');

const Calendar: React.FC = React.forwardRef((props, ref) => {
  const { id, className, groupClass, ownStyles } = props;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <div
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(className, groupClass, classes.ownStyles)}
      {...eventHandlers}
    >
      <CalendarWidget id={id} ownStyles={ownStyles} />
    </div>
  );
});

export default Calendar;
