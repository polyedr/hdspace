import React from 'react';
import cn from 'classnames';
import { makeStyles, Paper, MenuList } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { SelectMenuRendererProps } from '../types';
const styles = require('../styles.scss');

const SelectMenuComponent = (props: SelectMenuRendererProps) => {
  const { id, style, isDisabled, children, className, elementRef } = props;

  const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLElement).focus();
  };

  const EditableMenuClasses = makeStyles({
    root: {
      position: 'absolute',
      top: '0',
      left: '0',
      overflow: 'hidden',
      zIndex: 1,
      ...style,
    },
  })();

  return isDisabled ? (
    <div style={{ position: 'relative' }}>
      <Paper
        ref={elementRef}
        id={id}
        data-ls-id={id}
        tabIndex={0}
        key={id}
        className={cn(
          className,
          sharedClasses.unsortable,
          styles.addedElem,
          EditableMenuClasses.root
        )}
        elevation={8}
        onClick={handlePaperClick}
      >
        <MenuList>{children}</MenuList>
      </Paper>
    </div>
  ) : children;
};

export { SelectMenuComponent as SelectMenu };
