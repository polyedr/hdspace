/* eslint-disable react/button-has-type */
import React, { memo } from 'react';
import classNames from 'classnames';

const styles = require('./styles.scss');

const validTypes = [
  'none',
  'primary',
  'confirm',
  'secondary',
  'submit',
  'grey',
  'link',
];

const getStyleType = (styleType = 'confirm') => {
  if (validTypes.indexOf(styleType) !== -1) {
    return styles[`button_${styleType}`];
  }

  return styles.button_confirm;
};

interface IButtonProps {
  children?: any;
  type?: string;
  styleType?: string;
  disabled?: boolean;
  onClick?: (e: any) => void;
  className?: string;
}

const Button: React.FC<IButtonProps> = ({
  children,
  type,
  styleType,
  disabled,
  onClick,
  className = '',
}) => (
  <button
    type={type !== 'submit' ? 'button' : 'submit'}
    className={classNames(styles.button, getStyleType(styleType), className)}
    disabled={disabled}
    onClick={type !== 'submit' ? onClick : undefined}
  >
    <span>{children}</span>
  </button>
);

export default memo(Button);
