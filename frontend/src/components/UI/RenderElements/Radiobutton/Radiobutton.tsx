import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, Radio } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { sharedClassnames } from '$styles/sharedClassnames';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Radiobutton: Renderer = (props) => {
  const { id, style, params, isDisabled, active, sortableId, isRadioChecked, onChange } = props;
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
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      style={inlineStyles}
      className={cn(sharedClassnames.lsItem, isDisabled && styles.disabled, active && sharedClassnames.activated)}
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
