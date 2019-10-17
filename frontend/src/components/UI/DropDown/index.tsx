import React, { memo } from 'react';
import classNames from 'classnames';

const styles = require('./styles.scss');

export interface IDropDownOptions {
  value: string | number,
  label: string,
}

interface IComponentProps {
  options: IDropDownOptions[],
  defaultValue?: string | number,
  disabled?: boolean,
  onChange: (value) => void,
}


export const DropDown: React.FunctionComponent<IComponentProps> = memo(({
  options,
  defaultValue = '',
  onChange,
  disabled,
}) => {
  const handleChange = React.useCallback((event) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <select
      className={classNames(styles.dropDown, disabled && styles.dropDown_disabled)}
      disabled={disabled}
      value={defaultValue || ''}
      onChange={handleChange}
    >
      {
        options.map((item, idx) => (
          <option
            key={`option-${item.value}${idx}`}
            value={item.value}
            hidden={!item.value}
          >
            {item.label}
          </option>
        ))
      }
    </select>
  );
});
