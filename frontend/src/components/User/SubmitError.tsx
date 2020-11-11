import { Field } from 'react-final-form';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

type Props = {
  name: string;
};

const SubmitError: React.FC<Props> = ({ name }) => (
  <Field
    name={name}
    subscription={{ submitError: true, dirtySinceLastSubmit: true }}
  >
    {({ meta: { submitError, dirtySinceLastSubmit } }) =>
      submitError && !dirtySinceLastSubmit ? (
        <Alert variant="filled" severity="error">
          {submitError}
        </Alert>
      ) : null
    }
  </Field>
);

export default SubmitError;
