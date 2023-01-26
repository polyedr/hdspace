import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectShowingGrid } from '@Redux/project/selectors/base';
import { selectMasterScreenEnabled } from '@Redux/project/selectors/screen';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('div');

const Container = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const { name: elementName } = element;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const showGrid = useSelector(selectShowingGrid);
    const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
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
        style={
          (masterScreenEnabled && showGrid) ||
          (showGrid && elementName === 'Root' && !masterScreenEnabled)
            ? { background: 'transparent' }
            : {}
        }
        {...eventHandlers}
      >
        {children}
      </div>
    );
  },
);

export default Container;
