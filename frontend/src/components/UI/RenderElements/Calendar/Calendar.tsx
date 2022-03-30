import React from 'react';
import cn from 'classnames';
import CalendarWidget from '@Components/UI/Widgets/Calendar';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('clock');

const Calendar = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          groupClass,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        <CalendarWidget
          id={element.id}
          calendarSize={element.parameters.size}
          ownStyles={element.styles.ownStyles}
          disabled={isDisabled}
        />
      </div>
    );
  },
);

export default Calendar;
