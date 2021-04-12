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
  titleDialog: string;
  onSubmit: (...args: any) => void;
  onClose: () => void;
  withoutField?: boolean;
  fieldName?: string;
  initialValueName?: any;
  initialValueTags?: any;
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
  titleDialog,
  onSubmit,
  onClose,
  fieldName = '',
  initialValueName,
  initialValueTags: { title, description, keywords, viewport, author, refresh },
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
            <DialogTitle className={classes.dialogTitle}>
              {titleDialog}
            </DialogTitle>
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
                        margin="dense"
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
                    initialValue={title}
                  >
                    {({ input }) => (
                      <TextField
                        label="title"
                        variant="outlined"
                        margin="dense"
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
                    initialValue={description}
                  >
                    {({ input }) => (
                      <TextField
                        label="description"
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        placeholder="Short description of the page"
                        type={type || 'text'}
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>
                  <Field
                    name="keywords"
                    validate={validation}
                    initialValue={keywords}
                  >
                    {({ input }) => (
                      <TextField
                        label="keywords"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="List of keywords"
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>

                  <Field
                    name="viewport"
                    validate={validation}
                    initialValue={viewport}
                  >
                    {({ input }) => (
                      <TextField
                        label="viewport"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="Setting the viewport to make your website look good on all devices"
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>

                  <Field
                    name="author"
                    validate={validation}
                    initialValue={author}
                  >
                    {({ input }) => (
                      <TextField
                        label="author"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="Define the author of a page"
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>

                  <Field
                    name="refresh"
                    validate={validation}
                    initialValue={refresh}
                  >
                    {({ input }) => (
                      <TextField
                        label="refresh"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="Page refresh interval in seconds"
                        {...input}
                        style={{ marginTop: '12px' }}
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
