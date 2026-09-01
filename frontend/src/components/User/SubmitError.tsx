import React from 'react';
import { Field } from 'react-final-form';
import { Alert, AlertProps } from '@mui/material';

type Props = {
  name: string;
} & AlertProps;

const SubmitError: React.FC<Props> = ({ name, ...props }) => (
  <Field
    name={name}
    subscription={{ submitError: true, dirtySinceLastSubmit: true }}
  >
    {({ meta: { submitError, dirtySinceLastSubmit } }) =>
      submitError && !dirtySinceLastSubmit ? (
        <Alert variant="filled" severity="error" {...props}>
          {submitError}
        </Alert>
      ) : null
    }
  </Field>
);

export default SubmitError;
