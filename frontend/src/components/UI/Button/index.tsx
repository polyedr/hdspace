import React from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';

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
  if (validTypes.includes(styleType)) {
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

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, type, styleType, disabled, onClick, className = '' }, ref) => (
    <button
      type={type !== 'submit' ? 'button' : 'submit'}
      className={cn(styles.button, getStyleType(styleType), className)}
      disabled={disabled}
      onClick={type !== 'submit' ? onClick : undefined}
      ref={ref}
    >
      <span>{children}</span>
    </button>
  ),
);

export default Button;
