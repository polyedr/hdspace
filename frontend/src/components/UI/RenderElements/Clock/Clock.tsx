import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import ClockWidget from '../../Widgets/Clock';

const useStyles = makeComponentStyles('clock');

const Calendar: React.FC<RendererProps> = React.forwardRef<
  HTMLDivElement,
  RendererProps
>((props, ref) => {
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
        groupClass,
        classes.ownStyles,
        !isDisabled && classes.ownPseudoStyles,
      )}
      {...eventHandlers}
    >
      <ClockWidget id={element.id} />
    </div>
  );
});

export default Calendar;
