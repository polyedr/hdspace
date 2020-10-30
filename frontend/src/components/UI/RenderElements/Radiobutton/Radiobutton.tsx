// @ts-nocheck

import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, Radio } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { makeComponentStyles } from '../styles';

import { RadioRendererProps } from '../types';

const useStyles = makeComponentStyles();

const useIconStyles = makeStyles({
  entityStyles: ({ entityStyles: { width, height } }) => ({ width, height }),
  groupStyles: ({ groupStyles: { width, height } }) => ({ width, height }),
  ownStyles: ({ ownStyles: { width, height } }) => ({ width, height }),
});

const useDivStyles = makeStyles({
  default: {
    display: 'inline-block',
  },
  entityStyles: ({
    entityStyles: { backgroundColor, width, height, ...otherStyles },
  }) => ({
    ...otherStyles,
  }),
  groupStyles: ({
    groupStyles: { backgroundColor, width, height, ...otherStyles },
  }) => ({
    ...otherStyles,
  }),
  ownStyles: ({
    ownStyles: { backgroundColor, width, height, ...otherStyles },
  }) => ({
    ...otherStyles,
  }),
});

const Radiobutton: React.FC<RadioRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      params,
      isDisabled,
      isRadioChecked,
      onElementChange,
      className,
    } = props;
    const { name, value, showRipple } = params;

    const classes = useStyles(props);
    const iconClasses = useIconStyles(props);
    const divClasses = useDivStyles(props);

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
      onElementChange(name || '', event.target.value);
    };

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          isDisabled && classes.disabled,
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
      >
        <Radio
          checkedIcon={
            <RadioButtonCheckedIcon
              className={cn(
                iconClasses.entityStyles,
                iconClasses.groupStyles,
                iconClasses.ownStyles,
              )}
            />
          }
          icon={
            <RadioButtonUncheckedIcon
              className={cn(
                iconClasses.entityStyles,
                iconClasses.groupStyles,
                iconClasses.ownStyles,
              )}
            />
          }
          color="default"
          className={cn(
            classes.root,
            classes.entityStyles,
            classes.groupStyles,
            classes.ownStyles,
          )}
          value={value}
          name={name}
          checked={isRadioChecked}
          onChange={handleRadioChange}
          disableRipple={!showRipple}
        />
      </div>
    );
  },
);

export default Radiobutton;
