import React from 'react';
import { Field } from 'react-final-form';
import cn from 'classnames';

import styles from './FormField.scss';

interface Props {
  name: string;
  placeholder: string;
  label?: string;
  type: string;
  className?: string;
  validator: (value: string) => string | undefined;
}

function FormField(props: Props) {
  const {
    name,
    placeholder,
    label = '',
    type,
    validator,
    className = '',
  } = props;

  return (
    <div className={styles.container}>
      <Field name={name} validate={validator}>
        {({ input, meta }) => (
          <>
            {label ? (
              <label className={styles.label}>
                {label}
                <input
                  {...input}
                  type={type}
                  placeholder={placeholder}
                  className={cn(styles.textField, className)}
                />
              </label>
            ) : (
              <input
                {...input}
                type={type}
                placeholder={placeholder}
                className={cn(styles.textField, className)}
              />
            )}
            {meta.error && meta.touched && (
              <p className={styles.errorText}>{meta.error}</p>
            )}
          </>
        )}
      </Field>
    </div>
  );
}

export default FormField;
