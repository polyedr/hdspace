import React from 'react';
import {
  TextField as MuiTextField,
  styled,
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { Field } from 'react-final-form';

const CMuiTextField = styled(MuiTextField)({});

type TextFieldProps = MuiTextFieldProps & {
  name: string;
  validate: any;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, validate, ...props }, forwardRef) => (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        const hasError =
          (meta.touched && meta.error) ||
          (meta.submitError && !meta.dirtySinceLastSubmit);

        return (
          <CMuiTextField
            fullWidth
            variant="filled"
            {...props}
            {...input}
            error={hasError}
            helperText={hasError ? meta.error ?? meta.submitError : undefined}
            margin="dense"
            ref={forwardRef}
          />
        );
      }}
    </Field>
  ),
);
