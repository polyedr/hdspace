import React from 'react';
import { Field, Form } from 'react-final-form';

import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
} from '@material-ui/core';

interface Props {
  open: boolean;
  title: string;
  onSubmit: (...args: any) => void;
  onClose: () => void;
  description?: string;
  withoutField?: boolean;
  fieldName?: string;
  initialValueName?: any;
  initialValueTags?: string[];
  type?: string;
  validation?: any;
}

const Dialog: React.FC<Props> = ({
  open,
  title,
  onSubmit,
  onClose,
  fieldName = '',
  initialValueName,
  initialValueTags,
  description,
  withoutField = false,
  type,
  validation,
}) => (
  <MuiDialog open={open} onClose={onClose}>
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <DialogTitle>{title}</DialogTitle>

          <DialogContent>
            <DialogContentText>{description}</DialogContentText>

            {!withoutField && (
              <>
                <Field
                  name={fieldName}
                  initialValue={initialValueName}
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
                <Field
                  name="tags"
                  initialValue={initialValueTags}
                  validate={validation}
                >
                  {({ input }) => (
                    <TextField
                      margin="normal"
                      type={type || 'text'}
                      fullWidth
                      placeholder="Enter tags"
                      {...input}
                    />
                  )}
                </Field>
              </>
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

export default Dialog;
