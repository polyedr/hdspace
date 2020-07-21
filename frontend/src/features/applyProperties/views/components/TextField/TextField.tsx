import React from 'react';

const styles = require('./TextField.scss');

type Props = {
  value: string;
  onBlur(event: React.FocusEvent<HTMLInputElement>): void;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

const TextField = (props: Props) => {
  const { value, onBlur, onChange } = props;

  return (
    <input
      className={styles.textField}
      type="text"
      value={value}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};

export { TextField };
