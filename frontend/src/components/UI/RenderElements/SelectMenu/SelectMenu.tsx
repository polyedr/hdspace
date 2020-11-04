// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import { SelectMenuRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import sharedClasses from '../../../../styles/sharedClasses';
import useEventHandlers from '../useEventHandlers';

// const styles = require('../styles.scss');

const useStyles = makeComponentStyles({
  root: {
    position: 'absolute',
    top: '0',
    left: '0',
    overflow: 'hidden',
    zIndex: 1,
  },
});

const SelectMenu: React.FC<SelectMenuRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, children, className } = props;
    const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
      (event.target as HTMLElement).focus();
    };

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return isDisabled ? (
      <div style={{ position: 'relative' }}>
        <Paper
          ref={ref}
          id={id}
          data-ls-id={id}
          key={id}
          className={cn(
            className,
            sharedClasses.unsortable,
            classes.addedElem,
            classes.root,
            classes.entityStyles,
            classes.groupStyles,
            classes.ownStyles,
          )}
          elevation={8}
          onClick={handlePaperClick}
          {...eventHandlers}
        >
          <MenuList>{children}</MenuList>
        </Paper>
      </div>
    ) : (
      <>{children}</>
    );
  },
);

export default SelectMenu;
