import React, { memo } from 'react';
import classNames from 'classnames';

const styles = require('./styles.scss');

interface IComponentProps {
  name: string,
  label?: string,
  disabled?: boolean,
  isHidden?: boolean,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  checked?: boolean
  className?: string,
  children?: any,
}

export const Checkbox: React.FunctionComponent<IComponentProps> = memo(({
  name,
  label,
  onChange,
  checked,
  disabled,
  isHidden,
  children,
  className = '',
}) => (
  <label
    className={classNames(styles.checkbox, className)}
    htmlFor={name}
  >
    <input
      name={name}
      id={name}
      className={isHidden ? 'visuallyHidden' : undefined}
      type="checkbox"
      onChange={onChange}
      checked={checked}
      disabled={disabled}
    />
    <span>
      {label}
      {children}
    </span>
  </label>
));
