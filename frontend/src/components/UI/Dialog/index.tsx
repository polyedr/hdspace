import React from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { Field, Form } from 'react-final-form';
import TextField from '@material-ui/core/TextField';

type Props = {
  open: boolean;
  title: string;
  onSubmit: (...args: any) => void;
  onClose: () => void;
  description?: string;
  withoutField?: boolean;
  fieldName?: string;
  initialValue?: any;
  type?: string;
  validation?: any;
};

const Dialog: React.FC<Props> = ({
  open,
  title,
  onSubmit,
  onClose,
  fieldName = '',
  initialValue,
  description,
  withoutField = false,
  type,
  validation,
}) => {
  return (
    <MuiDialog open={open} onClose={onClose}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
              <DialogContentText>{description}</DialogContentText>

              {!withoutField && (
                <Field
                  name={fieldName}
                  initialValue={initialValue}
                  validate={validation}
                >
                  {({ input }) => (
                    <TextField
                      autoFocus
                      required
                      margin="normal"
                      type={type || 'text'}
                      fullWidth
                      {...input}
                    />
                  )}
                </Field>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} color="primary" variant="contained">
                Cancel
              </Button>

              <Button type="submit" color="secondary" variant="contained">
                Confirm
              </Button>
            </DialogActions>
          </form>
        )}
      />
    </MuiDialog>
  );
};

export default Dialog;
