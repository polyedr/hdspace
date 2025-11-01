import React from 'react';
import cn from 'classnames';
import * as Icons from '@mui/icons-material';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('icon', {});

const Icon = React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => {
  const { element, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;
  const { name, size, iconColor } = element.parameters;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  const IconElement = Icons[name];

  return (
    <div
      ref={ref}
      className={cn(
        className,
        groupClass,
        classes.ownStyles,
        isDisabled ? classes.disabled : classes.ownPseudoStyles,
      )}
      {...eventHandlers}
    >
      <IconElement style={{ fontSize: size, color: iconColor }} />
    </div>
  );
});

export default Icon;
