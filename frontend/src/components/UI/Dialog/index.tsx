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
  onClose: () => void;
  onSubmit: (...args: any) => void;
  title: string;
  description?: string;
  fieldName?: string;
  initialValue?: any;
  confirm?: boolean;
};

const Dialog: React.FC<Props> = ({
  open,
  onSubmit,
  onClose,
  fieldName = '',
  initialValue,
  title,
  description,
  confirm = false,
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

              {!confirm && (
                <Field name={fieldName} initialValue={initialValue}>
                  {({ input }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      type="text"
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
