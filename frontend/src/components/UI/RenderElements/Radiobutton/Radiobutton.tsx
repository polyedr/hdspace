import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, Radio } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { RadioRendererProps } from '../types';
const styles = require('../styles.scss');

const Radiobutton = (props: RadioRendererProps) => {
  const { id, style, params, isDisabled, sortableId, isRadioChecked, onChange, className, elementRef } = props;
  const { backgroundColor, width, height, ...restStyles } = style;
  const { name, value, showRipple } = params;

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

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(name || '', event.target.value);
  };

  const inlineStyles = { ...restStyles, display: 'inline-block' };

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
      <Radio
        checkedIcon={<RadioButtonCheckedIcon className={classes.icon} />}
        icon={<RadioButtonUncheckedIcon className={classes.icon} />}
        color="default"
        className={classes.root}
        value={value}
        name={name}
        checked={isRadioChecked}
        onChange={handleRadioChange}
        disableRipple={!showRipple}
      />
    </div>
  );
}

export { Radiobutton };
