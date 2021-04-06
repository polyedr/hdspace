import React from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Field, Form } from 'react-final-form';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  open: boolean;
  title: string;
  onSubmit: (...args: any) => void;
  onClose: () => void;
  withoutField?: boolean;
  fieldName?: string;
  initialValueName?: any;
  initialValueTitle?: any;
  initialValueDescription?: any;
  initialValueKeywords?: any;
  type?: string;
  validation?: any;
};
const useStyles = makeStyles({
  dialogTitle: {
    padding: '0',
    marginTop: '10px',
    marginBottom: '15px',
    textAlign: 'center',
  },
});
const ScreenEditDialog: React.FC<Props> = ({
  open,
  title,
  onSubmit,
  onClose,
  fieldName = '',
  initialValueName,
  initialValueTitle,
  initialValueDescription,
  initialValueKeywords,
  withoutField = false,
  type,
  validation,
}) => {
  const classes = useStyles();
  return (
    <MuiDialog open={open} onClose={onClose}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
            <DialogContent>
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
                        label="name screen"
                        variant="outlined"
                        margin="normal"
                        type={type || 'text'}
                        fullWidth
                        {...input}
                        style={{ marginTop: '0' }}
                      />
                    )}
                  </Field>
                  <DialogTitle className={classes.dialogTitle}>
                    Screen metatags
                  </DialogTitle>
                  <Field
                    name="title"
                    validate={validation}
                    initialValue={initialValueTitle}
                  >
                    {({ input }) => (
                      <TextField
                        label="title"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        placeholder="Page title"
                        type={type || 'text'}
                        {...input}
                        style={{ marginTop: '0' }}
                      />
                    )}
                  </Field>
                  <Field
                    name="description"
                    validate={validation}
                    initialValue={initialValueDescription}
                  >
                    {({ input }) => (
                      <TextField
                        label="description"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        placeholder="Short description of the page"
                        type={type || 'text'}
                        {...input}
                        style={{ marginTop: '5px' }}
                      />
                    )}
                  </Field>
                  <Field
                    name="keywords"
                    validate={validation}
                    initialValue={initialValueKeywords}
                  >
                    {({ input }) => (
                      <TextField
                        label="keywords"
                        variant="outlined"
                        margin="normal"
                        type={type || 'text'}
                        fullWidth
                        placeholder="List of keywords"
                        {...input}
                        style={{ marginTop: '5px' }}
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
};

export default ScreenEditDialog;
