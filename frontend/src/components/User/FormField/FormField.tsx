import React from 'react';
import { Field } from 'react-final-form';

const styles = require('./FormField.scss');

type Props = {
  name: string;
  placeholder: string;
  label: string;
  validator: (value: string) => string | undefined;
};

const FormField = (props: Props) => {
  const { name, placeholder, label, validator } = props;

  return (
    <div className={styles.container}>
      <Field name={name} validate={validator}>
        {({ input, meta }) => (
          <>
            <label className={styles.label}>
              {label}
              <input
                {...input}
                type="text"
                placeholder={placeholder}
                className={styles.textField}
              />
            </label>
            {meta.error && meta.touched && (
              <p className={styles.errorText}>{meta.error}</p>
            )}
          </>
        )}
      </Field>
    </div>
  );
};

export { FormField };
