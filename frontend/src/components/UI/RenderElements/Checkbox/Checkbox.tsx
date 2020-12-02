// @ts-nocheck

import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { Checkbox as MaterialCheckbox } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { CheckboxRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

const useCheckboxStyles = makeStyles({
  root: {},
  checked: {},
  entityStyles: ({ entityStyles }) => ({ color: entityStyles.backgroundColor }),
  groupStyles: ({ groupStyles }) => ({ color: groupStyles.backgroundColor }),
  ownStyles: ({ ownStyles }) => ({ color: ownStyles.backgroundColor }),
});

const useDivStyles = makeComponentStyles(
  {},
  ['backgroundColor', 'width', 'height'],
  {
    display: 'inline-block',
  },
);

const Checkbox: React.FC<CheckboxRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, isDisabled, className } = props;
    const { name, showRipple } = params;

    const isProtoMode = useSelector(selectIsPrototypeMode);

    const divClasses = useDivStyles(props);
    const checkboxClasses = useCheckboxStyles(props);

    const eventHandlers = useEventHandlers(props);
    const [isChecked, setIsChecked] = useState<boolean>(false);
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
        <MaterialCheckbox
          checkedIcon={<CheckBoxIcon className={checkboxClasses.icon} />}
          icon={<CheckBoxOutlineBlankIcon className={checkboxClasses.icon} />}
          color="default"
          className={cn(
            checkboxClasses.root,
            checkboxClasses.entityStyles,
            checkboxClasses.groupStyles,
            checkboxClasses.ownStyles,
          )}
          name={name}
          checked={isProtoMode && isChecked}
          disableRipple={!showRipple}
          onChange={handleChange}
        />
      </div>
    );
  },
);

export default Checkbox;
