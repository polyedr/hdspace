// @ts-nocheck

import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { makeStyles, Radio } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { RadioRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

const useRadiobuttonStyles = makeStyles({
  root: {},
  entityStyles: ({ entityStyles }) => ({
    color: entityStyles.backgroundColor,
  }),
  groupStyles: ({ groupStyles }) => ({
    color: groupStyles.backgroundColor,
  }),
  ownStyles: ({ ownStyles }) => ({
    color: ownStyles.backgroundColor,
  }),
});

const useIconStyles = makeStyles({
  entityStyles: ({ entityStyles }) => ({
    width: entityStyles.width,
    height: entityStyles.height,
  }),
  groupStyles: ({ groupStyles }) => ({
    width: groupStyles.width,
    height: groupStyles.height,
  }),
  ownStyles: ({ ownStyles }) => ({
    width: ownStyles.width,
    height: ownStyles.height,
  }),
});

const useDivStyles = makeComponentStyles(
  {},
  ['backgroundColor', 'width', 'height'],
  {
    display: 'inline-block',
  },
);

const Radiobutton: React.FC<RadioRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, isDisabled, className } = props;
    const { showRipple } = params;

    const isProtoMode = useSelector(selectIsPrototypeMode);

    const radiobuttonClasses = useRadiobuttonStyles(props);
    const iconClasses = useIconStyles(props);
    const divClasses = useDivStyles(props);

    const [isChecked, setIsChecked] = useState(false);

    const eventHandlers = useEventHandlers(props);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isProtoMode) {
          setIsChecked(event.target.checked);
        }
      },
      [isProtoMode],
    );

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          isDisabled && divClasses.disabled,
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
        {...eventHandlers}
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
            radiobuttonClasses.root,
            radiobuttonClasses.entityStyles,
            radiobuttonClasses.groupStyles,
            radiobuttonClasses.ownStyles,
          )}
          checked={isProtoMode && isChecked}
          onChange={handleChange}
          disableRipple={!showRipple}
        />
      </div>
    );
  },
);

export default Radiobutton;
