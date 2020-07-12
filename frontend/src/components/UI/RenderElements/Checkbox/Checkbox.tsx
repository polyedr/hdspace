import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, Checkbox } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { CheckboxRendererProps } from '../types';
const styles = require('../styles.scss');

const CheckboxComponent = (props: CheckboxRendererProps) => {
  const { id, style, params, isDisabled, sortableId, currentValue, onElementChange, isCheckboxChecked, elementRef, className } = props;
  const { backgroundColor, width, height, ...restStyles } = style;
  const { name, showRipple } = params;

  const classes = makeStyles({
    root: {
      color: backgroundColor,
      '&$checked': {
        color: backgroundColor,
      },
    },
    icon: {
      width,
      height,
    },
    checked: {},
  })();

  const inlineStyles = { ...restStyles, display: 'inline-block' };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    onElementChange(id, event.target.checked);
  };

  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      style={inlineStyles}
      className={cn(className, isDisabled && styles.disabled)}
      tabIndex={isDisabled ? 0 : -1}
    >
      <Checkbox
        checkedIcon={<CheckBoxIcon className={classes.icon} />}
        icon={<CheckBoxOutlineBlankIcon className={classes.icon} />}
        color="default"
        className={classes.root}
        value={currentValue}
        name={name}
        checked={isCheckboxChecked}
        disableRipple={!showRipple}
        onChange={handleCheckboxChange}
      />
    </div>
  );
}

export { CheckboxComponent as Checkbox};
