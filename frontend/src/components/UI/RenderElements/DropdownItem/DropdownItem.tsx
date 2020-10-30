// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem } from '@material-ui/core';
import { DropdownItemRendererProps } from '../types';
import sharedClasses from '../../../../styles/sharedClasses';

import makeComponentStyles from '../styles';
// const styles = require('../styles.scss');

const useStyles = makeComponentStyles();
const useDefaultStyles = makeStyles({
  'item:hover': ({ isDisabled }) => {
    if (isDisabled) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      };
    }
    return {};
  },
});

const DropdownItem: React.FC<DropdownItemRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, params, className } = props;
    const { showRipple, textContent } = params;

    const styles = useStyles(props);
    const defaultStyles = useDefaultStyles(props);

    return isDisabled ? (
      <MenuItem
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          defaultStyles.root,
          className,
          sharedClasses.unsortable,
          styles.addedElem,
          styles.disabled,
          styles.entityStyles,
          styles.groupStyles,
          styles.ownStyles,
        )}
        disableRipple
      >
        {textContent}
      </MenuItem>
    ) : (
      <MenuItem
        key={id}
        className={cn(
          defaultStyles.root,
          styles.entityStyles,
          styles.groupStyles,
          styles.ownStyles,
        )}
        disableRipple={!showRipple}
      >
        {textContent}
      </MenuItem>
    );
  },
);

export default DropdownItem;
