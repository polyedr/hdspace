import React, { memo } from 'react';
import classNames from 'classnames';

const styles = require('./styles.scss');

export interface IOptionsRadiobutton {
  name: string,
  label: string,
  value: number,
  disabled?: boolean,
}

interface IRadioButton {
  name: string,
  value: any,
  options: IOptionsRadiobutton[],
  className?: string,
  label?: string,
  disabled?: boolean,
  onChange: (e) => void,
}

export const RadioButtons: React.FunctionComponent<IRadioButton> = memo(({
  value,
  name,
  onChange,
  label,
  options,
  disabled = false,
  className = '',
}) => (
  <div className={classNames(className, styles.radiobuttonGroup, label ? styles.hasLabel : '', disabled ? styles.disabled : '')}>
    {label && (
      <span className="label">
        { label }
      </span>
    )}
    {options.map((o:IOptionsRadiobutton) => (
      <label key={o.name} htmlFor={o.name}>
        <input
          type="radio"
          value={o.value}
          name={name}
          id={o.name}
          checked={value === o.value}
          onChange={onChange}
          disabled={(o.disabled || disabled)}
        />
        <span>
          { o.label }
        </span>
      </label>
    ))}
  </div>
));
