import React from 'react';
import cn from 'classnames';
import GridLines from 'react-gridlines';
import { useSelector } from 'react-redux';
import { selectShowingGrid } from '@Redux/project/selectors/base';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('div');

const Container = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const showGrid = useSelector(selectShowingGrid);

    return (
      <>
        {showGrid ? (
          <GridLines
            className="grid-area"
            cellWidth={60}
            strokeWidth={2}
            cellWidth2={12}
          >
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
              style={{ background: 'transparent' }}
              {...eventHandlers}
            >
              {children}
            </div>
          </GridLines>
        ) : (
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
            {children}
          </div>
        )}
      </>
    );
  },
);

export default Container;
